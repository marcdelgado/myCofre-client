import {
  faBorderAll,
  faBorderNone,
  faTrashCan,
  faPenToSquare,
  faPlus,
  faCopy,
  faEye,
  faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons';

export abstract class Fontawesome {

  protected constructor() {
    // Constructor explícito, pero vacío
  }

  protected readonly faBorderAll = faBorderAll;
  protected readonly faBorderNone = faBorderNone;
  protected readonly faTrashCan = faTrashCan;
  protected readonly faPenToSquare = faPenToSquare;
  protected readonly faPlus = faPlus;
  protected readonly faCopy = faCopy;
  protected readonly faEye = faEye;
  protected readonly faMagnifyingGlass = faMagnifyingGlass;
}
