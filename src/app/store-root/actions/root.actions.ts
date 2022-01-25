import { createAction, props } from '@ngrx/store';
export const SetUserNft = createAction(
  '[Root] Set user nfts',
  props<{ nftIds: number[] }>()
);

export const SetUseHasValidTicket = createAction(
  '[Root] Set user has valid ticket',
  props<{ hasValidTicket: boolean }>()
);

export const SetIsOwner = createAction(
  '[Root] Set user the owner',
  props<{ isOwner: boolean }>()
);

export const SetAddress = createAction(
  '[Root] Set user address',
  props<{ address: string }>()
);
