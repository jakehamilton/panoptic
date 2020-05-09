export const findIngressForServices = (ingressroutes, services) => {
    const matching = [];
    for (const service of services) {
        for (const ingressroute of ingressroutes) {
            let matches = false;

            for (const route of ingressroute.spec.routes) {
                if (matches) {
                    break;
                }

                for (const routeService of route.services) {
                    if (service.metadata.name === routeService.name) {
                        matches = true;
                        break;
                    }
                }
            }

            if (matches) {
                matching.push(ingressroute);
            }
        }
    }

    return matching;
};

export const findServiceForDeployment = (services, deployment) => {
    const matching = [];

    const { labels } = deployment.spec.template.metadata;

    for (const service of services) {
        let matches = true;
        for (const [key, value] of Object.entries(service.spec.selector)) {
            if (!labels.hasOwnProperty(key) || labels[key] !== value) {
                matches = false;
                break;
            }
        }

        if (matches) {
            matching.push(service);
        }
    }

    return matching;
};

export const findIngressForDeployment = (
    ingressroutes,
    services,
    deployment,
) => {
    const matchingServices = findServiceForDeployment(services, deployment);
    const matchingIngress = findIngressForServices(
        ingressroutes,
        matchingServices,
    );

    return matchingIngress;
};
