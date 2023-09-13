TFS CLI
=================

Share files seamlessly with your without leaving your terminal

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@ownage-fdt/tfs-cli)](https://npmjs.org/package/@ownage-fdt/tfs-cli)
[![GitHub license](https://img.shields.io/github/license/Ownage-FDT/tfs-cli)](https://github.com/Ownage-FDT/tfs-cli/blob/main/LICENSE)
![GitHub Actions](https://github.com/Ownage-FDT/tfs-cli/actions/workflows/test.yml/badge.svg)

# Table of Contents

- [TFS CLI](#tfs-cli)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Commands](#commands)
  - [`tfs config list`](#tfs-config-list)
  - [`tfs config set`](#tfs-config-set)
  - [`tfs config set auth-token`](#tfs-config-set-auth-token)
  - [`tfs config set encryption-key`](#tfs-config-set-encryption-key)
  - [`tfs list`](#tfs-list)
  - [`tfs push`](#tfs-push)
  - [`tfs pull`](#tfs-pull)
  - [`tfs remove`](#tfs-remove)
  - [`tfs update`](#tfs-update)
  - [`tfs help [COMMANDS]`](#tfs-help-commands)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)


# Installation

You can install the package via npm:

```bash
npm install -g @ownage-fdt/tfs-cli
```

After installation, running `tfs` on your terminal should display a similar o utput to the one below:

```bash
VERSION
  @ownage-fdt/tfs-cli/1.0.0 linux-x64 node-v18.15.0

USAGE
  $ tfs COMMAND
...
```

# Commands
The following commands are available:

## `tfs config list`
List the configuration values

```bash
USAGE
  $ tfs config list

EXAMPLES
  $ tfs config list
```

## `tfs config set`

Set a configuration value for tfs

```bash
USAGE
  $ tfs config set COMMAND

COMMANDS
  config set auth-token      Authenticate and store an access token.
  config set encryption-key  Set the encryption key to use for encrypting and decrypting files.

EXAMPLES
  $ tfs config set auth-token <auth-token>
  $ tfs config set encryption-key <encryption-key>
```

## `tfs config set auth-token`

Authenticate and store an access token.

```bash
USAGE
  $ tfs config set auth-token <auth-token>

ARGUMENTS
  <auth-token>  The access token to use for authenticating requests.

EXAMPLES
  $ tfs config set auth-token <auth-token>
```

## `tfs config set encryption-key`

Set the encryption key to use for encrypting and decrypting files.

```bash
USAGE
  $ tfs config set encryption-key <encryption-key>

ARGUMENTS
  <encryption-key>  The encryption key to use for encrypting and decrypting files.

EXAMPLES
  $ tfs config set encryption-key <encryption-key>
```

## `tfs list`

List all files associated with your account.

```bash
USAGE
  $ tfs list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]]
    [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

EXAMPLES
  $ tfs list

  $ tfs list --output json
  
  $ tfs list --columns name,size
```

## `tfs push`

Push or upload a file to the server.

```bash
USAGE
  $ tfs push FILEPATH [-t <value>] [-k <value>]

ARGUMENTS
  FILEPATH           The absolute path to the file to upload.

FLAGS
  -k, --key=<value>  The key to use for encrypting the file.
  -t, --ttl=<value>  The time to live for the file in seconds.

EXAMPLES
  $ tfs push /path/to/file

  $ tfs push /path/to/file --ttl 3600

  $ tfs push /path/to/file --ttl 3600 --key my-secret-key
```

## `tfs pull`

Pull or download a file from the server.

```bash
USAGE
  $ tfs pull FILEID [-n <value>] [-f] [-o <value>] [-k <value>]

ARGUMENTS
  FILEID  The ID of the file to download.

FLAGS
  -f, --force           Force overwrite of existing file.
  -k, --key=<value>     The key to use for decrypting the file.
  -n, --name=<value>    The name of the file to save as.
  -o, --output=<value>  The absolute path to save the file to.

EXAMPLES
  $ tfs pull <file-id>

  $ tfs pull <file-id> --output /home/user/downloads

  $ tfs pull <file-id> --output /home/user/downloads --name my-file

  $ tfs pull <file-id> --output /home/user/downloads --key my-secret-key

  $ tfs pull <file-id> --output /home/user/downloads --name my-file --force

```

## `tfs remove`

Remove or delete a file from the server.

```bash
USAGE
  $ tfs remove FILEID

ARGUMENTS
  FILEID  The ID of the file to remove.

EXAMPLES
  $ tfs remove <fileId>
```

## `tfs update`

Update the tfs CLI.

```bash
USAGE
  $ tfs update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

EXAMPLES
  $ tfs update stable

  $ tfs update --version 1.0.0

  $ tfs update --interactive

  $ tfs update --available
```

## `tfs help [COMMANDS]`

Display help information for tfs.

```bash
USAGE
  $ tfs help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.
```

# Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.


# Credits
-   [Olayemi Olatayo](https://github.com/iamolayemi)
-   [All Contributors](../../contributors)

# License
The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
