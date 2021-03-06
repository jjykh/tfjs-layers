/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */

/**
 * Math utility functions.
 *
 * This file contains some frequently used math function that operates on
 * number[] or Float32Array and return a number. Many of these functions are
 * not-so-thick wrappers around TF.js Core functions. But they offer the
 * convenience of
 * 1) not having to convert the inputs into Tensors,
 * 2) not having to convert the returned Tensors to numbers.
 */

import * as tfc from '@tensorflow/tfjs-core';
import {scalar, Tensor1D, tensor1d} from '@tensorflow/tfjs-core';

export type ArrayTypes = Uint8Array|Int32Array|Float32Array;

/**
 * Determine if a number is an integer.
 */
export function isInteger(x: number): boolean {
  return x === parseInt(x.toString(), 10);
}

/**
 * Calculate the product of an array of numbers.
 * @param array The array to calculate the product over.
 * @param begin Beginning index, inclusive.
 * @param end Ending index, exclusive.
 * @return The product.
 */
export function arrayProd(
    array: number[]|ArrayTypes, begin?: number, end?: number): number {
  if (begin == null) {
    begin = 0;
  }
  if (end == null) {
    end = array.length;
  }

  let prod = 1;
  for (let i = begin; i < end; ++i) {
    prod *= array[i];
  }
  return prod;
}

/**
 * A helper function transforms the two input types to an instance of Tensor1D,
 * so the return value can be fed directly into various TF.js Core functions.
 * @param array
 */
function toArray1D(array: number[]|Float32Array): Tensor1D {
  array = Array.isArray(array) ? new Float32Array(array) : array;
  return tensor1d(array);
}

/**
 * Compute minimum value.
 * @param array
 * @return minimum value.
 */
export function min(array: number[]|Float32Array): number {
  return tfc.min(toArray1D(array)).dataSync()[0];
}

/**
 * Compute maximum value.
 * @param array
 * @return maximum value
 */
export function max(array: number[]|Float32Array): number {
  return tfc.max(toArray1D(array)).dataSync()[0];
}

/**
 * Compute sum of array.
 * @param array
 * @return The sum.
 */
export function sum(array: number[]|Float32Array): number {
  return tfc.sum(toArray1D(array)).dataSync()[0];
}

/**
 * Compute mean of array.
 * @param array
 * @return The mean.
 */
export function mean(array: number[]|Float32Array): number {
  return sum(array) / array.length;
}

/**
 * Compute variance of array.
 * @param array
 * @return The variance.
 */
export function variance(array: number[]|Float32Array): number {
  const demeaned = tfc.sub(toArray1D(array), scalar(mean(array)));
  const sumSquare = tfc.sum(tfc.mulStrict(demeaned, demeaned)).dataSync()[0];
  return sumSquare / array.length;
}
