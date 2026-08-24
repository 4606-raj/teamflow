import { api } from "@/shared/api/api";
import type { AxiosResponse } from "axios";

export const organizationApi = {
    create(data: any): Promise<AxiosResponse> {
        return api.post('/organizations', data);
    }
}