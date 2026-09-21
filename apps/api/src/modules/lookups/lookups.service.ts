import { Injectable } from '@nestjs/common';
import { LookupsRepository } from './lookups.repository';

@Injectable()
export class LookupsService {
	constructor(private readonly lookupRepo: LookupsRepository) {}

	getTechnologies() {
		return this.lookupRepo.getTechnologies()
	}

	getTags() {
		return this.lookupRepo.getTags()
	}
}
