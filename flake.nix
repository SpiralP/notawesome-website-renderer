{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
  };

  outputs = { nixpkgs, ... }:
    let
      inherit (nixpkgs) lib;

      makePackages = (pkgs:
        let
          nodeManifest = lib.importJSON ./package.json;
        in
        {
          default = pkgs.buildNpmPackage rec {
            pname = nodeManifest.name;
            version = nodeManifest.version;

            src = lib.sourceByRegex ./. [
              "^dist(/.*)?$"
              "^package-lock\.json$"
              "^package\.json$"
              "^src(/.*)?$"
              "^tsconfig\.json$"
            ];

            preBuild = ''
              rm -v node_modules/.bin/bun
            '';

            nativeBuildInputs = with pkgs; [
              bun
            ];

            npmRebuildFlags = [ "--ignore-scripts" ];

            npmConfigHook = pkgs.importNpmLock.npmConfigHook;
            npmDeps = pkgs.importNpmLock {
              npmRoot = src;
            };

            postInstall = ''
              mv $out/lib/node_modules/notawesome-website-renderer/dist/* $out/
              rm -rf $out/lib
            '';
          };
        }
      );
    in
    builtins.foldl' lib.recursiveUpdate { } (builtins.map
      (system:
        let
          pkgs = import nixpkgs {
            inherit system;
          };

          packages = makePackages pkgs;
        in
        {
          devShells.${system} = packages;
          packages.${system} = packages;
        })
      lib.systems.flakeExposed);
}
