import { Controller, Get } from '@nestjs/common';
import { LookupsService } from './lookups.service';

@Controller('lookups')
export class LookupsController {
	constructor(public readonly lookupsService: LookupsService) {}

	@Get('/technologies')
	getTechnologies() {
		return this.lookupsService.getTechnologies()
	}

	@Get('/tags')
	getTags() {
		return this.lookupsService.getTags()
	}
}
