% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/vtkWidget.R
\name{vtkMarchingCubes}
\alias{vtkMarchingCubes}
\title{vtk Volume Rendering}
\usage{
vtkMarchingCubes(
  image,
  isovalue,
  width = NULL,
  height = NULL,
  elementId = NULL
)
}
\arguments{
\item{image}{3d array, input to marching cubes}

\item{isovalue}{isovalue for marching cubes}
}
\description{
Convenience wrapper to create vtkWidget for
extracting and rendering an isosurface
}
\examples{

library(vtkwidgets)
vtkMarchingCubes( array(runif(1000), dim=rep(10, 3) ), 0.5 )

}
