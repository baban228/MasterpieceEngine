declare module '@api' {
    export function registerUserApi(data: { name: string; email: string; password: string }): Promise<any>;
    export function loginUserApi(data: { email: string; password: string }): Promise<any>;
    export function logoutApi(): Promise<any>;
    export function getUserApi(): Promise<any>;
    export function updateUserApi(data: { name: string; email: string }): Promise<any>;
    export function getIngredientsApi(): Promise<any>;
    export function getOrderApi(number: number): Promise<any>;
    export function postOrderApi(ingredients: string[]): Promise<any>;
    // Добавьте другие необходимые функции
  }