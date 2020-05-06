# Panoptic

> Showing or seeing the whole at one view.

Panoptic provides a useful display of your deployments.

![Preview image.](./.github/assets/screenshot.png)

## Usage

### From Source

Clone the repository:

```shell
git clone https://github.com/jakehamilton/panoptic.git

cd panoptic
```

Install dependencies:

```shell
yarn
```

Run the application (for configuration help):

```shell
# With Yarn
yarn start --help

# Or directly
node src/index.js --help
```

### Docker

```shell
docker run -it --rm \
    -v ./path/to/kubeconfig:/home/root/.kube/config \
    -e KUBECONFIG=/home/root/.kube/config \
    -p 3000:3000 \
    jakehamilton/panoptic --help
```

### From Release

Download the latest release for your platform [here](https://github.com/jakehamilton/panoptic/releases).

```shell
./panoptic --help
```
