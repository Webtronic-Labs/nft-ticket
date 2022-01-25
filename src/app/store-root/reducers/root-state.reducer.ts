import * as RootActionTypes from '../actions/root.actions';
import { createReducer, on } from '@ngrx/store';

export const rootStateFeatureKey = 'rootState';

export interface IRootState {
  nftList: number[];
  hasValidTicket: boolean;
  isOwner: boolean;
  address: string;
}

export const rootInitialState: IRootState = {
  nftList: [],
  hasValidTicket: false,
  isOwner: false,
  address: '',
};

export const rootReducer = createReducer(
  rootInitialState,
  on(RootActionTypes.SetUserNft, (state, action) => {
    return { ...state, nftList: action.nftIds };
  }),

  on(RootActionTypes.SetUseHasValidTicket, (state, action) => {
    return { ...state, hasValidTicket: action.hasValidTicket };
  }),

  on(RootActionTypes.SetIsOwner, (state, action) => {
    return { ...state, isOwner: action.isOwner };
  }),

  on(RootActionTypes.SetAddress, (state, action) => {
    return { ...state, address: action.address };
  })
);
