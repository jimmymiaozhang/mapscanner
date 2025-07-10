// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {wrapTo, UIStateActions, VisStateActions} from '@kepler.gl/actions';

// Import the kepler.gl injector and FilterManagerFactory
import {appInjector, FilterManagerFactory} from '@kepler.gl/components';

// Get the FilterManager component using the injector
const FilterManager = appInjector.get(FilterManagerFactory);

interface CustomFilterManagerProps {
  keplerGlId?: string;
}

const CustomFilterManager: React.FC<CustomFilterManagerProps> = ({keplerGlId = 'map'}) => {
  const dispatch = useDispatch();

  // Get state from kepler.gl Redux store
  const filters = useSelector((state: any) => state.demo.keplerGl[keplerGlId].visState.filters);
  const datasets = useSelector((state: any) => state.demo.keplerGl[keplerGlId].visState.datasets);
  const layers = useSelector((state: any) => state.demo.keplerGl[keplerGlId].visState.layers);
  const panelListView = useSelector((state: any) => state.demo.keplerGl[keplerGlId].uiState.filterPanelListView);

  // Action handlers for dataset operations
  const showDatasetTable = useCallback(
    (dataId: string) => dispatch(wrapTo(keplerGlId, VisStateActions.showDatasetTable(dataId))),
    [dispatch, keplerGlId]
  );

  const updateTableColor = useCallback(
    (dataId: string, newColor: any) => dispatch(wrapTo(keplerGlId, VisStateActions.updateTableColor(dataId, newColor))),
    [dispatch, keplerGlId]
  );

  const removeDataset = useCallback(
    (dataId: string) => dispatch(wrapTo(keplerGlId, VisStateActions.removeDataset(dataId))),
    [dispatch, keplerGlId]
  );

  const showAddDataModal = useCallback(
    () => dispatch(wrapTo(keplerGlId, UIStateActions.toggleModal('addData'))),
    [dispatch, keplerGlId]
  );

  // Action handlers for filter operations
  const addFilter = useCallback(
    (dataId: string) => dispatch(wrapTo(keplerGlId, VisStateActions.addFilter(dataId))),
    [dispatch, keplerGlId]
  );

  const removeFilter = useCallback(
    (idx: number) => dispatch(wrapTo(keplerGlId, VisStateActions.removeFilter(idx))),
    [dispatch, keplerGlId]
  );

  const setFilter = useCallback(
    (idx: number, prop: string, value: any) => dispatch(wrapTo(keplerGlId, VisStateActions.setFilter(idx, prop, value))),
    [dispatch, keplerGlId]
  );

  const setFilterPlot = useCallback(
    (idx: number, newProp: any) => dispatch(wrapTo(keplerGlId, VisStateActions.setFilterPlot(idx, newProp))),
    [dispatch, keplerGlId]
  );

  const toggleFilterAnimation = useCallback(
    (idx: number) => dispatch(wrapTo(keplerGlId, VisStateActions.toggleFilterAnimation(idx))),
    [dispatch, keplerGlId]
  );

  const toggleFilterFeature = useCallback(
    (idx: number) => dispatch(wrapTo(keplerGlId, VisStateActions.toggleFilterFeature(idx))),
    [dispatch, keplerGlId]
  );

  const setFilterView = useCallback(
    (idx: number, view: any) => dispatch(wrapTo(keplerGlId, VisStateActions.setFilterView(idx, view))),
    [dispatch, keplerGlId]
  );

  const syncTimeFilterWithLayerTimeline = useCallback(
    (filterId: string) => dispatch(wrapTo(keplerGlId, VisStateActions.syncTimeFilterWithLayerTimeline(filterId))),
    [dispatch, keplerGlId]
  );

  const togglePanelListView = useCallback(
    (params: any) => dispatch(wrapTo(keplerGlId, UIStateActions.togglePanelListView(params))),
    [dispatch, keplerGlId]
  );

  const visStateActions = useMemo(() => ({
    addFilter,
    removeFilter,
    setFilter,
    setFilterPlot,
    toggleFilterAnimation,
    toggleFilterFeature,
    setFilterView,
    syncTimeFilterWithLayerTimeline
  }), [addFilter, removeFilter, setFilter, setFilterPlot, toggleFilterAnimation, toggleFilterFeature, setFilterView, syncTimeFilterWithLayerTimeline]);

  const uiStateActions = useMemo(() => ({
    togglePanelListView
  }), [togglePanelListView]);

  const panelMetadata = {
    id: 'filter',
    label: 'sidebar.panels.filter',
    iconComponent: null
  };

  return (
    <FilterManager
      filters={filters}
      datasets={datasets}
      layers={layers}
      showDatasetTable={showDatasetTable}
      updateTableColor={updateTableColor}
      removeDataset={removeDataset}
      showAddDataModal={showAddDataModal}
      panelMetadata={panelMetadata}
      panelListView={panelListView}
      visStateActions={visStateActions}
      uiStateActions={uiStateActions}
    />
  );
};

export default CustomFilterManager; 