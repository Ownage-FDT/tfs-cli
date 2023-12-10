#!/bin/bash
set -e -o pipefail

# This will sign files after `oclif pack:deb`, this script should be ran from
# the `dist/deb` folder
echo "$GPG_PRIVATE_KEY" | base64 -d 2> /dev/null | gpg --import --batch --passphrase "$GPG_KEY_PASSPHRASE" 2> /dev/null
gpg --digest-algo SHA512 --clearsign --pinentry-mode loopback --passphrase "$GPG_KEY_PASSPHRASE" -u $GPG_KEY_ID -o InRelease Release 2> /dev/null
gpg --digest-algo SHA512 -abs --pinentry-mode loopback --passphrase "$GPG_KEY_PASSPHRASE" -u $GPG_KEY_ID -o Release.gpg Release 2> /dev/null
echo "Signed Debian Packages Successfully"
echo "sha256 sums:"
sha256sum *Release*

echo $GPG_PUBLIC_KEY | base64 --decode > release.key