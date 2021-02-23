HTMLWidgets.widget({

  name: 'vtkWidget',

  type: 'output',

  factory: function(el, width, height) {

    // pseudo imports (avoids having to use fully qualified names)
    var vtkFullScreenRenderWindow = vtk.Rendering.Misc.vtkFullScreenRenderWindow;
    var vtkImageData = vtk.Common.DataModel.vtkImageData;
    var vtkDataArray = vtk.Common.Core.vtkDataArray;
    var VtkDataTypes = vtkDataArray.VtkDataTypes;

    //object for storing properties acros render calls
    var global = {
      el: el,
      width: width,
      height: height,
      initialized: false,

      windowRenderer: vtkFullScreenRenderWindow.newInstance({
          rootContainer: el,
          containerStyle: {
          height: '100%',
          overflow: 'hidden',
          background: [0, 0, 0]
        }
      }),

      toVtkImageData: function(x){
        var scalars = vtkDataArray.newInstance({
          values: x.data,
          numberOfComponents: 1, // number of channels (grayscale)
          dataType: VtkDataTypes.FLOAT, // values encoding
          name: 'scalars'
        });

        var imageData = vtkImageData.newInstance();
        imageData.setOrigin(x.origin);
        imageData.setSpacing(x.spacing);
        imageData.setExtent(x.extent);
        imageData.getPointData().setScalars(scalars);
        return imageData
      },

    }

    var resizeFunction;

    return {

      renderValue: function(x) {
        resizeFunction = x.resizeFunction
        x.render(x, global)
      },

      resize: function(width, height) {
        if(resizeFunction)
          resizeFunction(width, height, global)
      }

    };
  }
});
