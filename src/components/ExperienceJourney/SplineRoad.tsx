import React, { useMemo } from 'react';
import * as THREE from 'three';
import { roadCurve, generateRoadRibbonGeometry, getCurveTransform } from '../../utils/roadCurve';

export const SplineRoad: React.FC = () => {
  // Generate ribbon road geometries along full continuous spline
  const { roadGeometry, curbLeftGeometry, curbRightGeometry, laneMarkingsGeometry } =
    useMemo(() => generateRoadRibbonGeometry(roadCurve, 5.2, 420), []);

  // Low-poly terrain plane across the entire world span (Z: -240 to +500)
  const terrainGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(420, 780, 84, 140);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      const distFromCenter = Math.abs(x);
      let elevation =
        Math.sin(x * 0.03) * 3.2 +
        Math.cos(z * 0.02) * 3.8 +
        Math.sin((x + z) * 0.045) * 2.0;

      // Keep corridor around the road clear and smooth
      if (distFromCenter < 14) {
        elevation = (elevation * (distFromCenter / 14)) - 0.35;
      }

      // Starting overlook area is smoothly graded
      if (z < -180) {
        elevation = -0.3;
      }

      pos.setY(i, elevation - 0.2);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      {/* Realistic Daytime Asphalt Road Surface */}
      <mesh geometry={roadGeometry} receiveShadow>
        <meshStandardMaterial
          color="#272b36"
          roughness={0.88}
          metalness={0.08}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* Left Concrete Curb */}
      <mesh geometry={curbLeftGeometry} receiveShadow castShadow>
        <meshStandardMaterial color="#94a3b8" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Right Concrete Curb */}
      <mesh geometry={curbRightGeometry} receiveShadow castShadow>
        <meshStandardMaterial color="#94a3b8" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Painted Yellow Highway Lane Markings (Natural daytime paint) */}
      <mesh geometry={laneMarkingsGeometry}>
        <meshStandardMaterial
          color="#facc15"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Wayfinding Directional Road Arrows (PRD §4.2) */}
      {[0.05, 0.22, 0.35, 0.52, 0.68, 0.82].map((tVal, idx) => {
        const tf = getCurveTransform(tVal);
        return (
          <group
            key={idx}
            position={[tf.position.x, tf.position.y + 0.04, tf.position.z]}
            rotation={[-Math.PI / 2, 0, tf.rotationY]}
          >
            <mesh>
              <coneGeometry args={[0.65, 1.3, 3]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
            </mesh>
          </group>
        );
      })}

      {/* Surrounding Natural Meadow / Hills Green Grass Terrain */}
      <mesh geometry={terrainGeometry} receiveShadow position={[0, -0.2, 120]}>
        <meshStandardMaterial
          color="#2d4a36"
          roughness={0.95}
          metalness={0.02}
          flatShading
        />
      </mesh>
    </group>
  );
};
