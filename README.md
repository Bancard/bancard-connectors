# Bancard Connectors

Bancard Connectors aims to be a collective repository containing different connectors, in different programming languages, that work smoothly with Bancard's products. 

This project is aimed at anyone who wishes to consume any of Bancard's services. It is maintained by Bancard.

## Folder Structure

In order to maintain the order of the repository, we've defined a minimal structure:

- First Folder: Indicates the product (vpos, boca-web, minipos)
- Second Folder: Indicates the sub product (checkout, vpos_1.0, reports, analytical) or sdk if the connector implements all of the product's operations.
- Third Folder: Indicates the technology (javascript, ruby, python, java, etc.)

Check folders for each connector.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Approval process

In order to ensure the quality of all connectors, each of them will pass through an approval process.

In a first stage we will check that:
 - It has a readme file.
 - It has tests and they run appropriately.
 - It follows [good practices of software engineering](https://blog.codinghorror.com/a-pragmatic-quick-reference/).

In a second stage we will:
 - Run the connector manually on a sandbox environment.
 - Verify that the readme explain clearly how to use it.
 - Run tests manually.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details