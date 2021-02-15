
function (x, global) {
  // pseudo imports (avoids having to use fully qualified names)
  var vtkImageData = vtk.Common.DataModel.vtkImageData;
  var vtkActor = vtk.Rendering.Core.vtkActor;
  var vtkImageMarchingCubes = vtk.Filters.General.vtkImageMarchingCubes;
  var vtkMapper = vtk.Rendering.Core.vtkMapper;

  var el = global.el
  var width = global.width
  var height = global.height

  const renderWindow = global.windowRenderer.getRenderWindow();
  const renderer = global.windowRenderer.getRenderer();

  if( !global.initialized ){
    global.actor = vtkActor.newInstance();
    renderer.addActor(global.actor);
    var props = global.actor.getProperty();
    props.setAmbient(0.1);
    props.setDiffuse(0.8);
    props.setSpecular(0);
    props.setSpecularPower(0);
    props.setOpacity(0.15);
    props.setLighting(true);
    props.setBackfaceCulling(true);
    props.setFrontfaceCulling(false);

    global.mapper = vtkMapper.newInstance();
    global.marchingCube = vtkImageMarchingCubes.newInstance({
      contourValue: 0.0,
      computeNormals: true,
      mergePoints: true,
    });
    global.mapper.setInputConnection(global.marchingCube.getOutputPort());
    global.actor.setMapper(global.mapper);

  }
  const imageData = global.toVtkImageData(x.data.image);
  global.marchingCube.setInputData(imageData);
  global.marchingCube.setContourValue(x.data.isovalue);
  if( !global.initialized ){
    global.initialized = true;
    renderer.resetCamera();
    renderer.getActiveCamera().elevation(-70);
    renderer.updateLightsGeometryToFollowCamera();
    renderer.setUseDepthPeeling(false);
    renderer.setMaximumNumberOfPeels(10);
    renderer.setOcclusionRatio(0.1);
  }

  renderWindow.render();
}
