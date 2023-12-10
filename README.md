TFS CLI
=================

TFS CLI is a command-line interface designed to simplify file sharing directly from your terminal. With TFS CLI, you can effortlessly upload, download, and manage files without leaving the command line.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@ownage-fdt/tfs-cli)](https://npmjs.org/package/@ownage-fdt/tfs-cli)
[![GitHub license](https://img.shields.io/github/license/Ownage-FDT/tfs-cli)](https://github.com/Ownage-FDT/tfs-cli/blob/main/LICENSE)
![GitHub Actions](https://github.com/Ownage-FDT/tfs-cli/actions/workflows/unit-test.yml/badge.svg)


# Table of Contents

- [TFS CLI](#tfs-cli)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Authentication Token](#authentication-token)
  - [Encryption Key (Optional)](#encryption-key-optional)
- [Usage Examples](#usage-examples)
  - [Pushing a File](#pushing-a-file)
  - [Pulling a File](#pulling-a-file)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)


# Installation

Install TFS CLI globally via npm:

```bash
npm install -g @ownage-fdt/tfs-cli
```

After installation, running `tfs` in your terminal should display output similar to the following:

```bash
VERSION
  @ownage-fdt/tfs-cli/1.0.0 linux-x64 node-v18.15.0

USAGE
  $ tfs COMMAND
...
```

# Configuration
TFS CLI provides powerful configuration options to tailor the tool to your needs. Let's delve into the tfs config set commands:

## Authentication Token
Authentication tokens are used to authenticate requests to the TFS API. Use the following command to set an authentication token:

```bash
tfs config set auth-token <auth-token>
```

You can obtain an authentication token from the [TFS Dashboard](https://trytfs.com/dashboard/get-started/auth-token).

## Encryption Key (Optional)
You can set a global encryption key optionally. This key is utilized for encrypting files during upload and decrypting them during download when no specific key is provided for each command. Execute the command below to set an encryption key:

```bash
tfs config set encryption-key <encryption-key>
```

# Usage Examples
To help you make the most of TFS CLI, here are some detailed usage examples for key commands:

## Pushing a File
Easily upload a file to the server with the `tfs push` command. For example, to upload a file with a specified time to live and encryption key:

```bash
tfs push /path/to/file --ttl 3600 --key my-secret-key
```

## Pulling a File
Easily download a file from the server with the `tfs pull` command. For example, to download a file with a specified encryption key:

```bash
tfs pull /path/to/file --key my-encryption-key
```

# Documentation

For detailed list of available commands. Your can checkout our documentation on [https://trytfs.com/documentation](https://trytfs.com/documentation).

Find yourself stuck using the tool? Found a bug? Do you have general questions or suggestions for improvement? Feel free to [open an issue on GitHub](https://github.com/Ownage-FDT/tfs-cli/issues/new)

# Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

# Credits
-   [Olayemi Olatayo](https://github.com/iamolayemi)
-   [All Contributors](../../contributors)

# License
The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
