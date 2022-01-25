import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  rootStateFeatureKey,
  IRootState,
} from '../reducers/root-state.reducer';

export const selectRootState =
  createFeatureSelector<IRootState>(rootStateFeatureKey);

export const selectUserNfts = createSelector(
  selectRootState,
  (rootState) => rootState.nftList
);

export const selectUserHasValidNft = createSelector(
  selectRootState,
  (rootState) => rootState.hasValidTicket
);

export const selectIsOwner = createSelector(
  selectRootState,
  (rootState) => rootState.isOwner
);

export const selectCurrentAddress = createSelector(
  selectRootState,
  (rootState) => rootState.address
);
