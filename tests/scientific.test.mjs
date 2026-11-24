/** Ejecutar: node --test tests/scientific.test.mjs (Node 22+) */
import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate} from '../programs/calculator/core/engine.js';
import {solvePolynomial,solveLinearSystem} from '../programs/calculator/modules/equations.js';
import {determinant,inverse} from '../programs/calculator/modules/matrices.js';
import {derivative,integrate} from '../programs/calculator/modules/calculus.js';
import {convertUnit} from '../programs/calculator/modules/units.js';
const close=(actual,want,tol=1e-9)=>assert.ok(Math.abs(actual-want)<tol,`${actual} ≠ ${want}`);
test('Aritmética, precedencia, fracciones y trigonometría',()=>{
 assert.equal(calculate('2+2').value,4);
 assert.equal(calculate('-2^2').value,-4);
 assert.equal(calculate('1/3+1/6').fraction,'1/2');
 close(calculate('sin(30)').value,0.5);
 close(calculate('root(-8,3)').value,-2);
});
test('Ecuación cuadrática: dos raíces distintas',()=>{
 const roots=solvePolynomial([1,-5,6]);
 assert.deepEqual(roots.map(r=>r.re).sort((a,b)=>a-b),[2,3]);
 assert.ok(roots.every(r=>r.im===0));
});
test('Ecuación cúbica: raíz doble real sin partes imaginarias ficticias',()=>{
 const roots=solvePolynomial([1,0,-3,2]);
 assert.equal(roots.length,3);
 close(roots[0].re,-2,1e-7);
 close(roots[1].re,1,1e-7);
 close(roots[2].re,1,1e-7);
 assert.ok(roots.every(r=>r.im===0),JSON.stringify(roots));
});
test('Ecuación cuártica: raíces reales distintas',()=>{
 const roots=solvePolynomial([1,0,-5,0,4]);
 assert.deepEqual(roots.map(r=>Math.round(r.re)),[-2,-1,1,2]);
 assert.ok(roots.every(r=>r.im===0));
});
test('Ecuación x⁴: raíz cuádruple en cero',()=>{
 const roots=solvePolynomial([1,0,0,0,0]);
 assert.equal(roots.length,4);
 assert.ok(roots.every(r=>Math.abs(r.re)<1e-8 && Math.abs(r.im)<1e-8));
});
test('Ecuación con soluciones complejas',()=>{
 const roots=solvePolynomial([1,0,1]);
 assert.equal(roots.length,2);
 assert.ok(roots.every(r=>Math.abs(r.re)<1e-12));
 assert.deepEqual(roots.map(r=>r.im).sort((a,b)=>a-b),[-1,1]);
});
test('Cuártica cuadrado perfecto: par complejo repetido',()=>{
 const roots=solvePolynomial([1,0,2,0,1]);
 assert.equal(roots.length,4);
 assert.ok(roots.every(r=>r.re===0));
 assert.deepEqual(roots.map(r=>r.im),[-1,-1,1,1]);
});
test('Sistema lineal pequeño bien escalado',()=>{
 const result=solveLinearSystem([[1e-14,0],[0,1e-14]],[1e-14,2e-14]);
 close(result[0],1);close(result[1],2);
});
test('Sistema grande bien escalado',()=>{
 const result=solveLinearSystem([[1e14,0],[0,1e14]],[1e14,2e14]);
 close(result[0],1);close(result[1],2);
});
test('Sistema singular detectado',()=>{
 assert.throws(()=>solveLinearSystem([[1,2],[2,4]],[3,6]),/singular/);
});
test('Matrices inversas y determinantes',()=>{
 close(determinant([[2,1],[3,4]]),5);
 const m=inverse([[2,1],[3,4]]);
 close(m[0][0],.8);close(m[0][1],-.2);
});
test('Derivada e integral numéricas',()=>{
 close(derivative('x^2',3).value,6,1e-8);
 close(integrate('x^2',0,1).value,1/3,1e-7);
});
test('Conversión de temperatura y energía',()=>{
 close(convertUnit(32,'Temperatura','°F','°C'),0);
 close(convertUnit(1,'Energía','kWh','J'),3600000);
});
