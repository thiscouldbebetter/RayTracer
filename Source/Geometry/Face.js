"use strict";
class Face {
    constructor(materialName, vertexIndices, textureUvsForVertices, normalsForVertices) {
        this.materialName = materialName;
        this.vertexIndices = vertexIndices;
        this.textureUvsForVertices = textureUvsForVertices;
        this.normalsForVertices = normalsForVertices;
    }
    static fromMaterialNameAndVertexIndices(materialName, vertexIndices) {
        return new Face(materialName, vertexIndices, null, null);
    }
    static fromMaterialNameVertexIndicesTextureUvsAndNormals(materialName, vertexIndices, textureUvsForVertices, normalsForVertices) {
        return new Face(materialName, vertexIndices, textureUvsForVertices, normalsForVertices);
    }
    buildTriangles(mesh) {
        var triangles = [];
        if (this.vertexIndices.length == 3) {
            triangles = [this.clone()];
        }
        else if (this.vertexIndices.length == 4) {
            triangles =
                [
                    this.buildTriangle(0, 1, 2).recalculateDerivedValues(mesh),
                    this.buildTriangle(2, 3, 0).recalculateDerivedValues(mesh),
                ];
        }
        else {
            var errorMessage = "A Face may only have 3 or 4 vertices.";
            throw errorMessage;
        }
        return triangles;
    }
    buildTriangle(vertexIndexIndex0, vertexIndexIndex1, vertexIndexIndex2) {
        var vertexIndex0 = this.vertexIndices[vertexIndexIndex0];
        var vertexIndex1 = this.vertexIndices[vertexIndexIndex1];
        var vertexIndex2 = this.vertexIndices[vertexIndexIndex2];
        var vertexIndices = [
            vertexIndex0,
            vertexIndex1,
            vertexIndex2
        ];
        var textureUvsForVertices = this.textureUvsForVertices;
        textureUvsForVertices =
            textureUvsForVertices == null
                ? null
                :
                    [
                        textureUvsForVertices[vertexIndexIndex0],
                        textureUvsForVertices[vertexIndexIndex1],
                        textureUvsForVertices[vertexIndexIndex2]
                    ];
        var normalsForVertices = this.normalsForVertices;
        normalsForVertices =
            normalsForVertices == null
                ? null
                :
                    [
                        normalsForVertices[vertexIndexIndex0],
                        normalsForVertices[vertexIndexIndex1],
                        normalsForVertices[vertexIndexIndex2],
                    ];
        var returnValue = Face.fromMaterialNameVertexIndicesTextureUvsAndNormals(this.materialName, vertexIndices, textureUvsForVertices, normalsForVertices);
        return returnValue;
    }
    edges() {
        if (this._edges == null) {
            var edges = [];
            for (var i = 0; i < this.vertexIndices.length; i++) {
                var iNext = NumberHelper.wrapValueToRange(i + 1, this.vertexIndices.length);
                var vertexIndex = this.vertexIndices[i];
                var vertexIndexNext = this.vertexIndices[iNext];
                var edge = Edge.fromVertexIndexPair(vertexIndex, vertexIndexNext);
                edges.push(edge);
            }
            this._edges = edges;
        }
        return this._edges;
    }
    interpolateVertexValuesForWeights(vertexValues, weights) {
        var valueInterpolated = this.vertexValueInterpolated()
            .overwriteWith(vertexValues[0])
            .multiplyScalar(weights[0]);
        var vertexValueWeighted = this.vertexValueWeighted();
        for (var i = 1; i < vertexValues.length; i++) {
            vertexValueWeighted
                .overwriteWith(vertexValues[i])
                .multiplyScalar(weights[i]);
            valueInterpolated.add(vertexValueWeighted);
        }
        return valueInterpolated;
    }
    material(scene) {
        return scene.materialByName(this.materialName);
    }
    normalForVertexWeights(mesh, vertexWeights) {
        var returnValue;
        if (this.normalsForVertices == null) {
            returnValue = this.plane(mesh).normal;
        }
        else {
            returnValue = this.interpolateVertexValuesForWeights(this.normalsForVertices, vertexWeights);
        }
        return returnValue;
    }
    plane(mesh) {
        if (this._plane == null) {
            var vertices = this.vertices(mesh);
            this._plane = new Plane(vertices.map(x => x.pos));
        }
        return this._plane;
    }
    recalculateDerivedValues(mesh) {
        if (this.normalsForVertices != null) {
            for (var i = 0; i < this.normalsForVertices.length; i++) {
                var normalForVertex = this.normalsForVertices[i];
                normalForVertex.normalize();
            }
        }
        var plane = this.plane(mesh);
        plane.recalculateDerivedValues();
        var triangles = this.triangles(mesh);
        if (triangles.length > 1) {
            for (var t = 0; t < triangles.length; t++) {
                var triangle = triangles[t];
                triangle.recalculateDerivedValues(mesh);
            }
        }
        var edges = this.edges();
        for (var i = 0; i < edges.length; i++) {
            edges[i].recalculateDerivedValues();
        }
        return this;
    }
    texelColorForVertexWeights(texture, vertexWeights) {
        var texelUv = this.interpolateVertexValuesForWeights(this.textureUvsForVertices, vertexWeights);
        var texelColor = this.texelColor();
        texture.colorSetFromUv(texelColor, texelUv);
        return texelColor;
    }
    triangles(mesh) {
        if (this._triangles == null) {
            this._triangles = this.buildTriangles(mesh);
        }
        return this._triangles;
    }
    vertexWeightsAtSurfacePosAddToList(mesh, surfacePos, weights) {
        var vertices = this.vertices(mesh);
        var edges = this.edges();
        var edge0Displacement = edges[0].displacement(mesh);
        var edge1Displacement = edges[1].displacement(mesh);
        var areaOfFace = edge1Displacement
            .clone()
            .crossProduct(edge0Displacement)
            .magnitude() / 2;
        var displacementFromVertexNextToPos = this.displacementFromVertexNextToPos();
        var weights = new Array();
        for (var i = 0; i < vertices.length; i++) {
            var iNext = NumberHelper.wrapValueToRange(i + 1, vertices.length);
            // var vertex = vertices[i];
            var vertexNext = vertices[iNext];
            displacementFromVertexNextToPos
                .overwriteWith(surfacePos)
                .subtract(vertexNext.pos);
            var displacementOfEdgeNext = edges[iNext].displacement(mesh);
            var areaOfTriangleFormedByEdgeNextAndPos = displacementOfEdgeNext.clone().crossProduct(displacementFromVertexNextToPos).magnitude() / 2;
            var weightOfVertex = areaOfTriangleFormedByEdgeNextAndPos
                / areaOfFace;
            weights[i] = weightOfVertex;
        }
        return weights;
    }
    vertex(mesh, vertexIndexIndex) {
        var vertexIndex = this.vertexIndices[vertexIndexIndex];
        var vertex = mesh.vertices[vertexIndex];
        return vertex;
    }
    vertices(mesh) {
        var returnValues = new Array();
        for (var i = 0; i < this.vertexIndices.length; i++) {
            var vertexIndex = this.vertexIndices[i];
            var vertex = mesh.vertices[vertexIndex];
            returnValues.push(vertex);
        }
        return returnValues;
    }
    // cloneable
    clone() {
        // todo - Deep clone.
        return new Face(this.materialName, this.vertexIndices, this.textureUvsForVertices, this.normalsForVertices);
    }
    // strings
    toStringForMesh(mesh) {
        var returnValue = this.vertices(mesh).join("->");
        return returnValue;
    }
    // Serializable.
    fromJson(objectAsJson) {
        throw new Error("To be implemented!");
    }
    toJson() {
        throw new Error("To be implemented!");
    }
    prototypesSet() {
        var typeSetOnObject = SerializableHelper.typeSetOnObject;
        if (this.textureUvsForVertices != null) {
            this.textureUvsForVertices.forEach(x => typeSetOnObject(Coords, x));
        }
        if (this.normalsForVertices != null) {
            this.normalsForVertices.forEach(x => typeSetOnObject(Coords, x));
        }
        /*
        var edges = this.edges();
        if (edges != null)
        {
            edges.forEach(x => typeSetOnObject(Edge, x) );
        }

        var plane = this.plane();
        if (plane != null)
        {
            typeSetOnObject(Plane, plane);
        }

        var triangles = this.triangles();
        if (triangles != null)
        {
            triangles.forEach(x => typeSetOnObject(Face, x) );
        }
        */
        return this;
    }
    // Temporary variables.
    displacementFromVertexNextToPos() {
        if (this._displacementFromVertexNextToPos == null) {
            this._displacementFromVertexNextToPos = Coords.create();
        }
        return this._displacementFromVertexNextToPos;
    }
    texelColor() {
        if (this._texelColor == null) {
            this._texelColor = Color.create();
        }
        return this._texelColor;
    }
    vertexValueInterpolated() {
        if (this._vertexValueInterpolated == null) {
            this._vertexValueInterpolated = Coords.create();
        }
        return this._vertexValueInterpolated;
    }
    vertexValueWeighted() {
        if (this._vertexValueWeighted == null) {
            this._vertexValueWeighted = Coords.create();
        }
        return this._vertexValueWeighted;
    }
}
