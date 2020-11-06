/* eslint-disable-next-line import/prefer-default-export */
export function validateStubCallCount(stub, count) {
  return stub && stub.callCount === count ? Promise.resolve() : Promise.reject();
}
