import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const RobotModel = () => {
  const { scene } = useGLTF('/path/to/your/robot/model.gltf'); // Adjust the path to your 3D model

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} />
      <primitive object={scene} scale={2} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default RobotModel;