import { api } from "@/shared/api/api";
import type { CreateOrganizationRequest } from '@teamflow/types';
import type { AxiosResponse } from "axios";

export const organizationApi = {
    create(data: CreateOrganizationRequest): Promise<AxiosResponse> {
        return api.post('/organizations', data);
    }
}