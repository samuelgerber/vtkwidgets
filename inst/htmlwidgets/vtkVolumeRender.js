HTMLWidgets.widget({

  name: 'vtkVolumeRender',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

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

    var volumeMapper = vtkVolumeMapper.newInstance();
    var volumeActor = vtkVolume.newInstance();
    var imageData = vtkImageData.newInstance();

    var initalized = false;
    var fullScreenRenderer;
    var renderWindow;
    var renderer;

    const controllerWidget = vtkVolumeController.newInstance({
      size: [400, 150],
      rescaleColorMap: true,
    });

    return {

      renderValue: function(x) {
        var scalars = vtkDataArray.newInstance({
          values: x.data,
          numberOfComponents: 1, // number of channels (grayscale)
          dataType: VtkDataTypes.FLOAT, // values encoding
          name: 'scalars'
        });

        imageData.setOrigin(0, 0, 0);
        imageData.setSpacing(1, 1, 1);
        imageData.setExtent(x.extent);
        imageData.getPointData().setScalars(scalars);
        imageData.modified();


        if( !initalized ){
          initalized = true;
          volumeMapper.setInputData(imageData);
          volumeMapper.setSampleDistance(0.7);
          volumeActor.setMapper(volumeMapper);
          initProps(volumeActor.getProperty());

          var fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
            rootContainer: el,
            containerStyle: {
              height: '100%',
              overflow: 'hidden',
              background: [0, 0, 0]
            }
          });
          renderWindow = fullScreenRenderer.getRenderWindow();
          renderer = fullScreenRenderer.getRenderer();

          controllerWidget.setContainer(el);
          const isBackgroundDark = true;
          controllerWidget.setupContent(renderWindow, volumeActor, isBackgroundDark);

          fullScreenRenderer.setResizeCallback(({ width, height }) => {
            // 2px padding + 2x1px boder + 5px edge = 14
            if (width > 414) {
              controllerWidget.setSize(400, 150);
            } else {
              controllerWidget.setSize(width - 14, 150);
            }
            controllerWidget.render();
            //fpsMonitor.update();
          });

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


          renderer.addVolume(volumeActor);
          renderer.resetCamera();
          renderer.getActiveCamera().elevation(-70);
          renderer.updateLightsGeometryToFollowCamera();

        }

        volumeActor.modified()
        controllerWidget.modified();
        renderWindow.render();

      },

      resize: function(width, height) {
        // TODO: code to re-render the widget with a new size
      }

    };
  }
});
