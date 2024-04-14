import { ArrowBackIosNew, FilterList } from '@mui/icons-material';
import { Container, IconButton, List, Pagination, Typography, useTheme } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation.js';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFilters } from '../../components/Filters/helpers/getFilters.ts';
import { Filters } from '../../components/Filters/index.tsx';
import { Loader } from '../../components/Loader/index.tsx';
import { LogEntryFull } from '../../components/LogEntryFull/index.tsx';
import { Modal } from '../../components/Modal/index.tsx';
import { NavBar } from '../../components/NavBar/index.tsx';
import { RequestGroupSummary } from '../../components/RequestGroupSummary/index.tsx';
import { RequestGroupSummaryHeadings } from '../../components/RequestGroupSummaryHeadings/index.tsx';
import { selectRequestGroupIdsFiltered } from '../../features/requestGroups/slice.ts';
import { logEntryModal } from '../../features/ui/slice.ts';
import { GraphqlBoxLogo } from '../../svgs/GraphqlBoxLogo.tsx';
import { type RequestGroupField, type Store } from '../../types.ts';
import { deriveVisibleIndexRange } from './helpers/deriveVisibleIndexRange.ts';
import { Header, ListingsContainer } from './styled.ts';

const defaultFields: RequestGroupField[] = [
  'timestamp',
  'duration',
  'operationName',
  'variables',
  'origin',
  'depth',
  'error',
];

export const Dashboard = () => {
  const QUERY_PARAM_NAME = 'page';
  const PER_PAGE = 100;
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = new URLSearchParams(useSearchParams());
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
            <Typography sx={{ color: theme.palette.primary.main, marginLeft: '1rem' }}>{`${filters.length} ${
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
              const newHref = [...searchParams].length > 0 ? `${pathname}?${searchParams.toString()}` : pathname;
              router.push(newHref);
            }}
            page={pageNumber}
          />
        </NavBar>
      </>
    ),
    [dependencyKey, fitersOpen] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <Container
      maxWidth={false}
      sx={{
        paddingBottom: theme.spacing(8),
        paddingTop: theme.spacing(2),
      }}
    >
      <Header>
        <GraphqlBoxLogo />
        <Typography component="h1" sx={{ marginLeft: '0.2rem' }} variant="h4">
          Graphql
          <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Box</span>
        </Typography>
      </Header>
      {memoRequestGroups}
      <Modal onClose={() => dispatch(logEntryModal(''))} open={!!logId}>
        <LogEntryFull logId={logId} />
      </Modal>
    </Container>
  );
};
