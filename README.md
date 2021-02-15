# vtkwidgets

R package for creating vtk.js widgets.

Work in progress ...

## Install
Run in R:
```R
install.packages("devtools")
library(devtools)
install_github("samuelgerber/vtkwidgets")
```

## Run

Volume rendering:
```R
library(vtkwidgets)
vtkVolumeRender( array(runif(1000), dim=rep(10, 3) ) )
```


Shiny bindings:
```R
library(vtkwidgets)
library(shiny)
runApp(list(
  ui = bootstrapPage(
    vtkWidgetOutput("volume1"),
    actionButton("update","update random volume")
  ),
  server = function(input, output) {
    value = reactive({
      input$update
      array(runif(1000), dim=rep(10, 3) )
    })

    output$volume1 <- renderVtkWidget({
      vtkVolumeRender(value())
    })
  }
))

```

## Create custom widgets

The vtkWidget function is a generic interface to pass vtk javascript
to be executed up on the widgets render call. The volume rendering above is
create by:
```R
data = vtkImageData(image)
render = readLines( system.file("vtkscripts", "volumerender.js", package = "vtkwidgets") )
vtkWidget(data, renderFunction=render)
```

The vtkWidget function takes as input a data lst that is parsed thorugh JSON and
passed to the renderFunction. The renderFunction is javascript code (as a
string literal) that has two inputs

- x the data passed to the widget as a javascript object.
- global: an object that can be used to store stat persistent across calls to the
  widget render function. The global setup contains some default setup and convenience
  functions, which you can see in [vtkWidget.js](inst/htmlwidgets/vtkWidget.js).

For an example to see how to pass data and setup a vtk pipeline
[volumerender.js](inst/vtkscripts/volumerender.js).

This setup allwos to pass your own vtk.js pipeline and data to the vtkWidget.




