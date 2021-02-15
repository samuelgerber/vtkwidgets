#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @examples
#'
#' library(vtkwidgets)
#'
#' vtkWidget()
#'
#' @export
vtkWidget <- function(data, renderFunction = "function(x, global){}",
                            resizeFunction = "function(width, height, global){}",
                            width = NULL, height = NULL, elementId = NULL) {
  # forward options using x
  dim = dim(image) - 1
  x = list(
    data = data,
    render = JS(renderFunction),
    resize = JS(resizeFunction)
  )
  #print(toJSON(x.data))

  # create widget
  htmlwidgets::createWidget(
    name = 'vtkWidget',
    x,
    width = width,
    height = height,
    package = 'vtkwidgets',
    elementId = elementId
  )
}

#' <Add Title>
#'
#' <Add Description>
#'
#' @export
vtkImageData <- function(a, origin=rep(0, length(dim(a))), spacing=rep(1, length(dim(a))) ){
  dim = dim(a) - 1
  list(
    data = as.vector(a),
    extent = c(0, dim[1], 0, dim[2], 0, dim[3]),
    origin = origin,
    spacing = spacing
  )
}


#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @examples
#'
#' library(vtkwidgets)
#' vtkVolumeRender( array(runif(1000), dim=rep(10, 3) ) )
#'
#' @export
vtkVolumeRender <- function(image, width = NULL, height = NULL, elementId = NULL) {
  data = vtkImageData(image)
  render = readLines( system.file("vtkscripts", "volumerender.js", package = "vtkwidgets") )
  vtkWidget(data, renderFunction=render, width=width, height=height, elementId=elementId)
}

#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @examples
#'
#' library(vtkwidgets)
#' vtkMarchingCubes( array(runif(1000), dim=rep(10, 3) ), 0.5 )
#'
#' @export
vtkMarchingCubes <- function(image, isovalue, width = NULL, height = NULL, elementId = NULL) {
  data = list(image = vtkImageData(image), isovalue=isovalue)
  render = readLines( system.file("vtkscripts", "marchingcubes.js", package = "vtkwidgets") )
  vtkWidget(data, renderFunction=render, width=width, height=height, elementId=elementId)
}




#' Shiny bindings for vtkWidget
#'
#' Output and render functions for using vtkWidget within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a vtkWidget
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name vtkWidget-shiny
#'
#' @export
vtkWidgetOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'vtkWidget',
                                 width, height, package = 'vtkwidgets')
}

#' @rdname vtkWidget-shiny
#'
#' @examples
#'
#' library(vtkwidgets)
#' library(shiny)
#'
#' runApp(list(
#'  ui = bootstrapPage(
#'    actionButton("update","update gauge"),
#'    # example use of the automatically generated output function
#'    vtkWidgetOutput("volume1")
#'  ),
#'  server = function(input, output) {
#'
#'    # reactive that generates a random value for the gauge
#'    value = reactive({
#'      input$update
#'      array(runif(1000), dim=rep(10, 3) )
#'    })
#'
#'    # example use of the automatically generated render function
#'    output$volume1 <- renderVtkWidget({
#'      vtkWidget(value())
#'    })
#'  }
#'))
#'
#' @export
renderVtkWidget <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, vtkWidgetOutput, env, quoted = TRUE)
}
