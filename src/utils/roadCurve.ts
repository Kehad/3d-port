import * as THREE from 'three';

// Continuous 3D Highway Spline traversing 4 thematic environments:
// Zone 1: Garage & Shutter Exit (t: 0.00 - 0.20)
// Zone 2: Digital Grid / Skills Toll Gates (t: 0.20 - 0.48)
// Zone 3: Experience Scenic Highway & Bus Stops (t: 0.48 - 0.74)
// Zone 4: City Showroom Plaza & Terminal (t: 0.74 - 1.00)
export const WORLD_PATH_POINTS: THREE.Vector3[] = [
  // Garage Zone (straight line runway for launchpad)
  new THREE.Vector3(0, 0, -230),   // Parked car position (t ~ 0)
  new THREE.Vector3(0, 0, -195),   // Garage interior
  new THREE.Vector3(0, 0, -155),   // Shutter door threshold (t ~ 0.12)
  new THREE.Vector3(0, 0.4, -115), // Acceleration out of garage

  // Skills Cyber Toll Gates Zone (gentle S-curves)
  new THREE.Vector3(14, 1.2, -70), // Gate 1 (~0.24)
  new THREE.Vector3(-16, 2.0, -20),// Gate 2 (~0.31)
  new THREE.Vector3(18, 2.6, 30),  // Gate 3 (~0.38)
  new THREE.Vector3(-12, 2.0, 80), // Gate 4 (~0.45)

  // Experience Bus Stop Zone (rolling elevation curves)
  new THREE.Vector3(22, 1.5, 130), // Stop 1 (~0.52)
  new THREE.Vector3(-24, 2.8, 180),// Stop 2 (~0.58)
  new THREE.Vector3(16, 3.2, 230), // Stop 3 (~0.65)
  new THREE.Vector3(-15, 1.8, 280),// Stop 4 (~0.71)

  // City Showroom / Drive-In Showcase Zone
  new THREE.Vector3(12, 0.6, 330), // Showroom Bay 1 (~0.79)
  new THREE.Vector3(-10, 0.3, 380),// Showroom Bay 2 (~0.86)
  new THREE.Vector3(8, 0.1, 430),  // Showroom Bay 3 (~0.93)
  new THREE.Vector3(0, 0, 480),   // Finish Terminal / Contact Pad (t = 1.0)
];

export const roadCurve = new THREE.CatmullRomCurve3(
  WORLD_PATH_POINTS,
  false,
  'centripetal',
  0.5
);

export interface CurveTransform {
  position: THREE.Vector3;
  tangent: THREE.Vector3;
  normal: THREE.Vector3;
  binormal: THREE.Vector3;
  rotationY: number;
}

export function getCurveTransform(t: number): CurveTransform {
  const clampedT = THREE.MathUtils.clamp(t, 0, 0.999);
  const position = roadCurve.getPointAt(clampedT);
  const tangent = roadCurve.getTangentAt(clampedT).normalize();

  const up = new THREE.Vector3(0, 1, 0);
  const binormal = new THREE.Vector3().crossVectors(tangent, up).normalize();
  const normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();
  const rotationY = Math.atan2(tangent.x, tangent.z);

  return { position, tangent, normal, binormal, rotationY };
}

export function getZoneFromProgress(t: number): {
  id: 'garage' | 'skills' | 'experience' | 'projects';
  name: string;
  code: string;
  gear: string;
} {
  if (t < 0.18) {
    const gear = t < 0.04 ? 'P' : 'D1';
    return { id: 'garage', name: 'THE GARAGE // IGNITION', code: 'SECTOR_01', gear };
  }
  if (t < 0.48) {
    return { id: 'skills', name: 'CYBER EXPRESSWAY // TOLL GATES', code: 'SECTOR_02', gear: 'D2' };
  }
  if (t < 0.74) {
    return { id: 'experience', name: 'SCENIC HIGHWAY // BUS STOPS', code: 'SECTOR_03', gear: 'D3' };
  }
  return { id: 'projects', name: 'CITY SHOWROOM // DRIVE-IN PLAZA', code: 'SECTOR_04', gear: 'OD' };
}

/**
 * Creates custom ribbon/road geometry along the CatmullRom curve
 * with UV coordinates for seamless asphalt texture and road markings.
 */
export function generateRoadRibbonGeometry(
  curve: THREE.CatmullRomCurve3,
  width: number = 5.2,
  segments: number = 420
): {
  roadGeometry: THREE.BufferGeometry;
  curbLeftGeometry: THREE.BufferGeometry;
  curbRightGeometry: THREE.BufferGeometry;
  laneMarkingsGeometry: THREE.BufferGeometry;
} {
  const vertices: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const leftCurbVerts: number[] = [];
  const leftCurbIndices: number[] = [];
  const rightCurbVerts: number[] = [];
  const rightCurbIndices: number[] = [];

  const laneVerts: number[] = [];
  const laneIndices: number[] = [];

  const up = new THREE.Vector3(0, 1, 0);
  const halfWidth = width / 2;
  const curbWidth = 0.55;
  const curbHeight = 0.16;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const pt = curve.getPointAt(t);
    const tan = curve.getTangentAt(t).normalize();
    const right = new THREE.Vector3().crossVectors(tan, up).normalize();

    // Road surface points
    const leftPt = pt.clone().addScaledVector(right, -halfWidth);
    const rightPt = pt.clone().addScaledVector(right, halfWidth);

    leftPt.y += 0.05;
    rightPt.y += 0.05;

    vertices.push(leftPt.x, leftPt.y, leftPt.z);
    vertices.push(rightPt.x, rightPt.y, rightPt.z);

    uvs.push(0, t * 100);
    uvs.push(1, t * 100);

    // Curbs
    const curbLeftOuter = leftPt.clone().addScaledVector(right, -curbWidth);
    curbLeftOuter.y += curbHeight;
    leftCurbVerts.push(curbLeftOuter.x, curbLeftOuter.y, curbLeftOuter.z);
    leftCurbVerts.push(leftPt.x, leftPt.y + curbHeight, leftPt.z);

    const curbRightOuter = rightPt.clone().addScaledVector(right, curbWidth);
    curbRightOuter.y += curbHeight;
    rightCurbVerts.push(rightPt.x, rightPt.y + curbHeight, rightPt.z);
    rightCurbVerts.push(curbRightOuter.x, curbRightOuter.y, curbRightOuter.z);

    // Center lane dashes
    const centerL = pt.clone().addScaledVector(right, -0.09);
    const centerR = pt.clone().addScaledVector(right, 0.09);
    centerL.y += 0.07;
    centerR.y += 0.07;
    laneVerts.push(centerL.x, centerL.y, centerL.z);
    laneVerts.push(centerR.x, centerR.y, centerR.z);

    if (i < segments) {
      const idx = i * 2;
      indices.push(idx, idx + 1, idx + 2);
      indices.push(idx + 1, idx + 3, idx + 2);

      leftCurbIndices.push(idx, idx + 1, idx + 2);
      leftCurbIndices.push(idx + 1, idx + 3, idx + 2);

      rightCurbIndices.push(idx, idx + 1, idx + 2);
      rightCurbIndices.push(idx + 1, idx + 3, idx + 2);

      laneIndices.push(idx, idx + 1, idx + 2);
      laneIndices.push(idx + 1, idx + 3, idx + 2);
    }
  }

  const roadGeo = new THREE.BufferGeometry();
  roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  roadGeo.setIndex(indices);
  roadGeo.computeVertexNormals();

  const curbLGeo = new THREE.BufferGeometry();
  curbLGeo.setAttribute('position', new THREE.Float32BufferAttribute(leftCurbVerts, 3));
  curbLGeo.setIndex(leftCurbIndices);
  curbLGeo.computeVertexNormals();

  const curbRGeo = new THREE.BufferGeometry();
  curbRGeo.setAttribute('position', new THREE.Float32BufferAttribute(rightCurbVerts, 3));
  curbRGeo.setIndex(rightCurbIndices);
  curbRGeo.computeVertexNormals();

  const laneGeo = new THREE.BufferGeometry();
  laneGeo.setAttribute('position', new THREE.Float32BufferAttribute(laneVerts, 3));
  laneGeo.setIndex(laneIndices);
  laneGeo.computeVertexNormals();

  return {
    roadGeometry: roadGeo,
    curbLeftGeometry: curbLGeo,
    curbRightGeometry: curbRGeo,
    laneMarkingsGeometry: laneGeo,
  };
}
