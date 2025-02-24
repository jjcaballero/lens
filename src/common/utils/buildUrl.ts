/**
 * Copyright (c) 2021 OpenLens Authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { compile } from "path-to-regexp";

export interface IURLParams<P extends object = {}, Q extends object = {}> {
  params?: P;
  query?: Q;
  fragment?: string;
}

export function buildURL<P extends object = {}, Q extends object = {}>(path: string | any) {
  const pathBuilder = compile(String(path));

  return function ({ params, query, fragment }: IURLParams<P, Q> = {}): string {
    const queryParams = query ? new URLSearchParams(Object.entries(query)).toString() : "";
    const parts = [
      pathBuilder(params),
      queryParams && `?${queryParams}`,
      fragment && `#${fragment}`,
    ];

    return parts.filter(Boolean).join("");
  };
}

export function buildURLPositional<P extends object = {}, Q extends object = {}>(path: string | any) {
  const builder = buildURL(path);

  return function(params?: P, query?: Q, fragment?: string): string {
    return builder({ params, query, fragment });
  };
}
