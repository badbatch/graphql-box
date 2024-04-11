import { ArrowBackIosNew, FilterList } from '@mui/icons-material';
import { IconButton, List, Pagination, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFilters } from '../../components/Filters/helpers/getFilters.ts';
import { Filters } from '../../components/Filters/index.tsx';
import Loader from '../../components/Loader';
import LogEntryFull from '../../components/LogEntryFull';
import Modal from '../../components/Modal';
import NavBar from '../../components/NavBar';
import RequestGroupSummary from '../../components/RequestGroupSummary';
import RequestGroupSummaryHeadings from '../../components/RequestGroupSummaryHeadings';
import { selectRequestGroupIdsFiltered } from '../../features/requestGroups/slice';
import { logEntryModal } from '../../features/ui/slice';
import { type RequestGroupField, type Store } from '../../types';
import deriveVisibleIndexRange from './helpers/deriveVisibleIndexRange';
import { ListingsContainer } from './styled';

const defaultFields: RequestGroupField[] = [
  'timestamp',
  'duration',
  'operationName',
  'variables',
  'origin',
  'depth',
  'error',
];

const Page = () => {
  const QUERY_PARAM_NAME = 'page';
  const PER_PAGE = 100;
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = getFilters(searchParams, { mandatory: ['timeWindow'] });
  const requestGroupIds = useSelector((state: Store) => selectRequestGroupIdsFiltered(state, filters));
  const logId = useSelector((state: Store) => state.ui.logEntryModal);
  const dispatch = useDispatch();
  const [fitersOpen, setFiltersOpen] = useState(true);
  const pageNumber = Number(searchParams.get(QUERY_PARAM_NAME) ?? 1);
  const visibleIndexRange = deriveVisibleIndexRange(pageNumber, PER_PAGE);
  const visibleRequestGroupIds = requestGroupIds.slice(...visibleIndexRange);
  const totalPages = Math.ceil(requestGroupIds.length / PER_PAGE);
  const dependencyKey = JSON.stringify(visibleRequestGroupIds);

  const memoRequestGroups = useMemo(
    () => (
      <>
        <NavBar position="top" sx={{ alignItems: 'center' }}>
          <IconButton
            aria-label="Filter results"
            color={filters.length > 0 ? 'primary' : 'default'}
            edge="end"
            onClick={() => setFiltersOpen(!fitersOpen)}
          >
            {fitersOpen ? <ArrowBackIosNew /> : <FilterList />}
          </IconButton>
          {filters.length > 0 ? (
            <Typography sx={{ color: theme => theme.palette.primary.main, marginLeft: '1rem' }}>{`${filters.length} ${
              filters.length === 1 ? 'filter' : 'filters'
            } applied`}</Typography>
          ) : null}
        </NavBar>
        <ListingsContainer fitersOpen={fitersOpen}>
          <Filters filters={filters} />
          {visibleRequestGroupIds.length > 0 ? (
            <>
              <RequestGroupSummaryHeadings fields={defaultFields} />
              <List className="request-group-summaries" sx={{ padding: 0 }}>
                {visibleRequestGroupIds.map(requestGroupId => (
                  <li key={requestGroupId}>
                    <RequestGroupSummary fields={defaultFields} requestGroupId={requestGroupId} />
                  </li>
                ))}
              </List>
            </>
          ) : (
            <Loader sx={{ marginTop: '3rem' }} />
          )}
        </ListingsContainer>
        <NavBar position="bottom" sx={{ justifyContent: 'flex-end' }}>
          <Pagination
            color="primary"
            count={totalPages}
            onChange={(_event, value) => {
              searchParams.set('page', String(value));
              setSearchParams(searchParams);
            }}
            page={pageNumber}
          />
        </NavBar>
      </>
    ),
    [dependencyKey, fitersOpen] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <>
      {memoRequestGroups}
      <Modal onClose={() => dispatch(logEntryModal(''))} open={!!logId}>
        <LogEntryFull logId={logId} />
      </Modal>
    </>
  );
};

// nextjs requires this to be default export
// eslint-disable-next-line import/no-default-export
export default Page;
