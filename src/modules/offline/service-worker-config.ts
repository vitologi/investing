export interface IConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

export const serviceWorkerConfig: IConfig = {
  onSuccess: (registration) => {
    console.log('onSuccess: ', registration);
  },
  onUpdate: (registration) => {
    console.log('onSuccess: ', registration);
  },
};
