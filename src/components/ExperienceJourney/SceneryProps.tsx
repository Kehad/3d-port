import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Instances, Instance } from '@react-three/drei';
import { roadCurve } from '../../utils/roadCurve';

interface TreeTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  foliageColor: string;
}

interface LampTransform {
  position: [number, number, number];
  rotationY: number;
}

export const SceneryProps: React.FC = () => {
  const { trees, lamps, rocks } = useMemo(() => {
    const treeList: TreeTransform[] = [];
    const lampList: LampTransform[] = [];
    const rockList: { position: [number, number, number]; scale: number }[] = [];

    const foliageColors = ['#15803d', '#166534', '#047857', '#0f766e', '#1e3a8a'];
    const up = new THREE.Vector3(0, 1, 0);

    const steps = 140;
    for (let i = 2; i < steps - 2; i++) {
      const t = i / steps;
      const pt = roadCurve.getPointAt(t);

      // Only place trees and natural roadside props in outdoors (skip garage z < -150 and city plaza z > 310)
      if (pt.z < -145 || pt.z > 310) continue;

      const tan = roadCurve.getTangentAt(t).normalize();
      const right = new THREE.Vector3().crossVectors(tan, up).normalize();

      // Street Lamps every 8 steps
      if (i % 8 === 0) {
        const lampPos = pt.clone().addScaledVector(right, -3.9);
        lampPos.y = pt.y;
        const rotY = Math.atan2(tan.x, tan.z);
        lampList.push({
          position: [lampPos.x, lampPos.y, lampPos.z],
          rotationY: rotY,
        });
      }

      // Left Trees
      const leftDist = 7.5 + ((i * 13) % 18);
      const leftTreePos = pt.clone().addScaledVector(right, -leftDist);
      leftTreePos.y = pt.y - 0.2 + (((i * 7) % 5) * 0.15);
      const treeScaleL = 0.85 + ((i * 11) % 6) * 0.1;
      treeList.push({
        position: [leftTreePos.x, leftTreePos.y, leftTreePos.z],
        rotation: [0, (i * 45 * Math.PI) / 180, 0],
        scale: [treeScaleL, treeScaleL, treeScaleL],
        foliageColor: foliageColors[i % foliageColors.length],
      });

      // Right Trees (skip near bus stops and toll gates)
      const isNearMilestone =
        (t > 0.22 && t < 0.26) ||
        (t > 0.29 && t < 0.33) ||
        (t > 0.36 && t < 0.40) ||
        (t > 0.43 && t < 0.47) ||
        (t > 0.50 && t < 0.54) ||
        (t > 0.56 && t < 0.60) ||
        (t > 0.63 && t < 0.67) ||
        (t > 0.69 && t < 0.73);

      if (!isNearMilestone) {
        const rightDist = 8.0 + ((i * 17) % 19);
        const rightTreePos = pt.clone().addScaledVector(right, rightDist);
        rightTreePos.y = pt.y - 0.2 + (((i * 9) % 5) * 0.15);
        const treeScaleR = 0.8 + ((i * 13) % 7) * 0.1;
        treeList.push({
          position: [rightTreePos.x, rightTreePos.y, rightTreePos.z],
          rotation: [0, ((i * 67 + 30) * Math.PI) / 180, 0],
          scale: [treeScaleR, treeScaleR, treeScaleR],
          foliageColor: foliageColors[(i + 2) % foliageColors.length],
        });
      }

      // Rocks
      if (i % 6 === 0) {
        const side = i % 2 === 0 ? 1 : -1;
        const rockPos = pt.clone().addScaledVector(right, side * (5.5 + ((i * 3) % 5)));
        rockPos.y = pt.y + 0.1;
        rockList.push({
          position: [rockPos.x, rockPos.y, rockPos.z],
          scale: 0.5 + ((i * 7) % 5) * 0.15,
        });
      }
    }

    return { trees: treeList, lamps: lampList, rocks: rockList };
  }, []);

  return (
    <group>
      {/* Instanced Tree Trunks */}
      <Instances limit={trees.length} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 2.2, 7]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
        {trees.map((tree, i) => (
          <Instance
            key={`trunk-${i}`}
            position={[tree.position[0], tree.position[1] + 1.1 * tree.scale[1], tree.position[2]]}
            scale={tree.scale}
          />
        ))}
      </Instances>

      {/* Instanced Tree Foliage Cone 1 */}
      <Instances limit={trees.length} castShadow>
        <coneGeometry args={[1.5, 2.5, 6]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} flatShading />
        {trees.map((tree, i) => (
          <Instance
            key={`cone1-${i}`}
            position={[tree.position[0], tree.position[1] + 2.7 * tree.scale[1], tree.position[2]]}
            rotation={tree.rotation}
            scale={tree.scale}
            color={tree.foliageColor}
          />
        ))}
      </Instances>

      {/* Instanced Tree Foliage Cone 2 */}
      <Instances limit={trees.length} castShadow>
        <coneGeometry args={[1.1, 2.0, 6]} />
        <meshStandardMaterial color="#16a34a" roughness={0.7} flatShading />
        {trees.map((tree, i) => (
          <Instance
            key={`cone2-${i}`}
            position={[tree.position[0], tree.position[1] + 4.1 * tree.scale[1], tree.position[2]]}
            rotation={tree.rotation}
            scale={[tree.scale[0] * 0.85, tree.scale[1] * 0.85, tree.scale[2] * 0.85]}
            color={tree.foliageColor}
          />
        ))}
      </Instances>

      {/* Instanced Rocks */}
      <Instances limit={rocks.length} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#334155" roughness={0.9} flatShading />
        {rocks.map((rock, i) => (
          <Instance
            key={`rock-${i}`}
            position={rock.position}
            scale={[rock.scale, rock.scale * 0.7, rock.scale * 1.2]}
            rotation={[0.2 * i, 0.4 * i, 0]}
          />
        ))}
      </Instances>

      {/* Modern Street Lamps */}
      {lamps.map((lamp, i) => (
        <group
          key={`lamp-${i}`}
          position={lamp.position}
          rotation={[0, lamp.rotationY, 0]}
        >
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.1, 5, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.7, 5.0, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.4, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[1.25, 5.4, 0]}>
            <boxGeometry args={[0.6, 0.1, 0.25]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[1.25, 5.34, 0]}>
            <boxGeometry args={[0.5, 0.02, 0.2]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#fef08a"
              emissiveIntensity={3}
              toneMapped={false}
            />
          </mesh>
          {i % 3 === 0 && (
            <spotLight
              position={[1.25, 5.3, 0]}
              target-position={[2.0, 0, 0]}
              color="#fef08a"
              intensity={7}
              distance={15}
              angle={0.65}
              penumbra={0.7}
            />
          )}
        </group>
      ))}
    </group>
  );
};
