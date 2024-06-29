"use strict";
class MeshHelper {
    static buildCubeUnit(name, material) {
        var materialName = material.name;
        var c = (x, y) => Coords.fromXY(x, y);
        var returnValue = new Mesh(name, 
        // vertices
        [
            new Vertex(new Coords(-1, -1, -1)),
            new Vertex(new Coords(1, -1, -1)),
            new Vertex(new Coords(1, 1, -1)),
            new Vertex(new Coords(-1, 1, -1)),
            new Vertex(new Coords(-1, -1, 1)),
            new Vertex(new Coords(1, -1, 1)),
            new Vertex(new Coords(1, 1, 1)),
            new Vertex(new Coords(-1, 1, 1)), // 7
        ], 
        // faces
        [
            new Face(materialName, [3, 2, 1, 0], [c(0, 1), c(1, 1), c(1, 0), c(0, 0)], null),
            new Face(materialName, [4, 5, 6, 7], [c(0, 0), c(1, 0), c(1, 1), c(0, 1)], null),
            new Face(materialName, [0, 1, 5, 4], [c(1, 0), c(0, 0), c(0, 1), c(1, 1)], null),
            new Face(materialName, [2, 3, 7, 6], [c(1, 0), c(0, 0), c(0, 1), c(1, 1)], null),
            new Face(materialName, [1, 2, 6, 5], [c(1, 0), c(0, 0), c(0, 1), c(1, 1)], null),
            new Face(materialName, [4, 7, 3, 0], [c(0, 1), c(1, 1), c(1, 0), c(0, 0)], null), // west
        ]);
        return returnValue;
    }
    static transformMeshVertexPositions(mesh, transform) {
        for (var v = 0; v < mesh.vertices.length; v++) {
            var vertex = mesh.vertices[v];
            transform.transformCoords(vertex.pos);
        }
        mesh.recalculateDerivedValues();
        return mesh;
    }
}
