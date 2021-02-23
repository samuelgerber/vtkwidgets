function (x, global) {
  // pseudo imports (avoids having to use fully qualified names)
  var vtkFullScreenRenderWindow = vtk.Rendering.Misc.vtkFullScreenRenderWindow;
  var vtkImageData = vtk.Common.DataModel.vtkImageData;
  var vtkDataArray = vtk.Common.Core.vtkDataArray;
  var vtkVolume = vtk.Rendering.Core.vtkVolume;
  var vtkVolumeMapper = vtk.Rendering.Core.vtkVolumeMapper;
  var vtkColorTransferFunction = vtk.Rendering.Core.vtkColorTransferFunction;
  var vtkPiecewiseFunction = vtk.Common.DataModel.vtkPiecewiseFunction;
  var VtkDataTypes = vtkDataArray.VtkDataTypes;
  var vtkVolumeController = vtk.Interaction.UI.vtkVolumeController;
  var vtkActor = vtk.Rendering.Core.vtkActor;
  var vtkImageMarchingCubes = vtk.Filters.General.vtkImageMarchingCubes;
  var vtkMapper = vtk.Rendering.Core.vtkMapper;
  var vtkImageMapper = vtk.Rendering.Core.vtkImageMapper;

  // A few helper functions
  function initProps(property) {
    property.setRGBTransferFunction(0, newColorFunction());
    property.setScalarOpacity(0, newOpacityFunction());
    property.setScalarOpacityUnitDistance(0, 4.5);
    property.setInterpolationTypeToLinear();
    property.setUseGradientOpacity(0, true);
    property.setGradientOpacityMinimumValue(0, 0, 5);
    property.setGradientOpacityMinimumOpacity(0, 0.0);

    property.setGradientOpacityMaximumValue(0, 1);
    property.setGradientOpacityMaximumOpacity(0, 1.0);
    property.setShade(true);
    property.setAmbient(0.2);
    property.setDiffuse(0.7);
    property.setSpecular(0.3);
    property.setSpecularPower(8.0);
  }

  function newColorFunction() {
    var fun = vtkColorTransferFunction.newInstance();
    fun.addRGBPoint(0, 0.4, 0.2, 0.0);
    fun.addRGBPoint(1, 1.0, 1.0, 1.0);
    return fun;
  }

  function newOpacityFunction() {
    var fun = vtkPiecewiseFunction.newInstance();
    fun.addPoint(0, 0);
    fun.addPoint(0.5, 0);
    fun.addPoint(0.5, 1);
    fun.addPoint(1, 1);
    return fun;
  }

  var el = global.el
  var width = global.width
  var height = global.height

  const renderWindow = global.windowRenderer.getRenderWindow();
  const renderer = global.windowRenderer.getRenderer();

  if( !global.initialized ){
    global.volumeMapper = vtkVolumeMapper.newInstance();
    global.volumeMapper.setSampleDistance(0.7);
    global.volumeActor = vtkVolume.newInstance();
    global.volumeActor.setMapper(global.volumeMapper);
    initProps( global.volumeActor.getProperty() );
  }

  var imageData = global.toVtkImageData(x.data);
  global.volumeMapper.setInputData(imageData);

  if( !global.initialized ){
    global.initialized = true;
    global.controllerWidget = vtkVolumeController.newInstance({
      size: [400, 150],
      rescaleColorMap: true,
    });
    global.controllerWidget.setContainer(el);
    const isBackgroundDark = true;
    global.controllerWidget.setupContent(renderWindow, global.volumeActor,
      isBackgroundDark, true, 'PuOr');

    global.windowRenderer.setResizeCallback(({ width, height }) => {
      // 2px padding + 2x1px boder + 5px edge = 14
      if (width > 414) {
        global.controllerWidget.setSize(400, 150);
      } else {
        global.controllerWidget.setSize(width - 14, 150);
      }
      global.controllerWidget.render();
    });

    renderer.addVolume(global.volumeActor);
    renderer.resetCamera();
    renderer.getActiveCamera().elevation(-70);
    renderer.updateLightsGeometryToFollowCamera();
  }
  else{
    global.volumeMapper.modified();
    global.volumeActor.modified();
    var widget = global.controllerWidget.getWidget();
    widget.setDataArray(imageData.getPointData().getScalars().getData() );
    global.controllerWidget.modified();
    global.controllerWidget.render();
  }

  renderWindow.render();

}
