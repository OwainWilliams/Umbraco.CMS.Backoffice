/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type HealthCheckActionRequestModel = {
    healthCheckKey?: string;
    alias?: string | null;
    name?: string | null;
    description?: string | null;
    valueRequired?: boolean;
    providedValue?: string | null;
    providedValueValidation?: string | null;
    providedValueValidationRegex?: string | null;
};