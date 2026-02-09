import {
  createContainer as createAwilixContainer,
  InjectionMode,
} from "awilix";

export type AppContainer = ReturnType<typeof createAwilixContainer>;

let containerInstance: AppContainer | null = null;

export function createContainer(): AppContainer {
  return createAwilixContainer({
    injectionMode: InjectionMode.PROXY,
  });
}

export function setContainer(container: AppContainer): void {
  containerInstance = container;
}

export function getContainer(): AppContainer {
  if (!containerInstance) {
    throw new Error(
      "Container not initialized. Ensure AppInitializer has run.",
    );
  }
  return containerInstance;
}

export function getContainerOrNull(): AppContainer | null {
  return containerInstance;
}
