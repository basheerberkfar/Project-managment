import type { RoleDto } from '../../service';
import { rolesListActionNames } from './action-names';
import type { RolesListSort, RolesListState } from './initial-state';

export type RolesListAction =
  | {
      type: typeof rolesListActionNames.setSearch;
      payload: string;
    }
  | {
      type: typeof rolesListActionNames.setPageIndex;
      payload: number;
    }
  | {
      type: typeof rolesListActionNames.setPageSize;
      payload: number;
    }
  | {
      type: typeof rolesListActionNames.setSort;
      payload?: RolesListSort;
    }
  | {
      type: typeof rolesListActionNames.setSelectedRole;
      payload: RoleDto | null;
    };

export function rolesListReducer(
  state: RolesListState,
  action: RolesListAction
): RolesListState {
  switch (action.type) {
    case rolesListActionNames.setSearch:
      return {
        ...state,
        search: action.payload,
        pageIndex: 1,
      };

    case rolesListActionNames.setPageIndex:
      return {
        ...state,
        pageIndex: action.payload,
      };

    case rolesListActionNames.setPageSize:
      return {
        ...state,
        pageSize: action.payload,
        pageIndex: 1,
      };

    case rolesListActionNames.setSort:
      return {
        ...state,
        sort: action.payload,
      };

    case rolesListActionNames.setSelectedRole:
      return {
        ...state,
        selectedRole: action.payload,
      };

    default:
      return state;
  }
}
