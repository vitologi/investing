import {inject, injectable} from 'inversify';
import {DomainStore} from "../../../shared/models/domain-store";
import {IPortfolioDto} from "../shared/interfaces/portfolio.dto";
import {Portfolio} from "../shared/models/portfolio";
import {PortfoliosService} from "../shared/services/portfolios.service";
import {computed, makeObservable} from "mobx";

@injectable()
export class PortfoliosStore extends DomainStore<IPortfolioDto, Portfolio> {
  constructor(@inject('PortfoliosService') portfoliosService: PortfoliosService) {
    super(portfoliosService);

    makeObservable(this, {
      name: computed,
    })
  }

  get name(): (id: string | null) => string {
    return (id: string | null) => {
      const model = this.list.find((item) => item.id === id);
      return model ? model.name : '-';
    }
  }

  createEmpty(): Portfolio {
    return new Portfolio(this);
  }

  createFromDto(dto: IPortfolioDto): Portfolio {
    const model = new Portfolio(this, dto._id);
    model.updateFromDto(dto);
    return model;
  }

  protected initialize(): void {
    this.load();
  }

  // override delete with check (TODO: implement checking by usable item in other collection)
  async delete(dto: IPortfolioDto): Promise<void | IPortfolioDto> {
    if (!confirm("Do you really need to delete this portfolio, result can be unrestorable")) {
      return;
    }
    return super.delete(dto);
  }

}
