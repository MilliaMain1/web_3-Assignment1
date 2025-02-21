{
  description = "A simple script";

  outputs = { self, nixpkgs }: {
    defaultPackage.x86_64-linux = self.packages.x86_64-linux.my-script;

    packages.x86_64-linux.my-script =
      let
        pkgs = import nixpkgs { system = "x86_64-linux"; };
      in
      pkgs.writeShellScriptBin "my-script" ''
        # Base URL
        BASE_URL="http://localhost:3000/api"

        # Define an array of paths
        PATHS=(
            "/eras"
            "/paintings/5"
            "/artists"
            "/eras"
            "/galleries"
            "/galleries/30"
            "/galleries/Calgary"
            "/galleries/country/fra"
            "/artists"
            "/artists/12"
            "/artists/1223423"
            "/artists/search/ma"
            "/artists/search/mA"
            "/artists/country/fra"
            "/paintings"
            "/paintings/sort/year"
            "/paintings/63"
            "/paintings/search/port"
            "/paintings/search/pORt"
            "/paintings/search/connolly"
            "/paintings/years/1800/1850"
            "/paintings/galleries/5"
            "/paintings/artist/16"
            "/paintings/artist/666"
            "/paintings/artist/country/ital"
            "/genres"
            "/genres/76"
            "/genres/painting/408"
            "/genres/painting/jsdfhg"
            "/paintings/genre/78"
            "/paintings/era/2"
            "/counts/genres"
            "/counts/artists"
            "/counts/topgenres/20"
            "/counts/topgenres/2034958"
        )

        # Loop through each path and curl it
        for PATH in "''${PATHS[@]}"; do
            FULL_URL="$BASE_URL$PATH"
            echo "Fetching: $FULL_URL"
            ${pkgs.curl}/bin/curl -s "$FULL_URL" | ${pkgs.bat}/bin/bat --language=json --style=plain
            echo "--------------------------------------"
        done
      '';
  };
}
