# Manage Local Documentation

Documents from `Vutron` can be viewed in the local environment through the VitePress viewer.

This function works only when the entire project is cloned. If you created the project with `npm init`, the `docs` folder is not included.

Since VitePress and related plugin packages are configured to be selectively installed, they cannot be installed with `npm i`.

Install the relevant packages using the following preconfigured script commands:

```shell
$ npm run docs:install
```

You can run the local server where the documents are hosted via the command below.

```shell
$ npm run docs:dev
```
