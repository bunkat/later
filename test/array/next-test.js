var later = require('../../index'),
    should = require('should');

describe('Later.array.next', function() {

  it('should exist', function() {
    should.exist(later.array.next);
  });

  it('should return the next highest value', function() {
    var arr = [1,2,4,5],
        cur = 3,
        zeroVal = 5,
        expected = 4,
        actual = later.array.next(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return the next highest value with array size of 1', function() {
    var arr = [1],
        cur = 3,
        zeroVal = 5,
        expected = 1,
        actual = later.array.next(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return the next highest value with array size of 1 with same value', function() {
    var arr = [1],
        cur = 1,
        zeroVal = 5,
        expected = 1,
        actual = later.array.next(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return the next highest value with array size of 1 with zero value', function() {
    var arr = [0],
        cur = 30,
        zeroVal = 31,
        expected = 31,
        actual = later.array.next(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return the next highest value which might be the first value', function() {
    var arr = [1,2,3,4,5],
        cur = 0,
        zeroVal = 5,
        expected = 1,
        actual = later.array.next(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return the next highest value, wrapping if needed', function() {
    var arr = [0,1,2,3,4,5],
        cur = 6,
        zeroVal = 0,
        expected = 0,
        actual = later.array.next(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return the next highest value, which might be zero', function() {
    var arr = [1,2,3,4,5,0],
        cur = 6,
        zeroVal = 10,
        expected = 10,
        actual = later.array.next(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return current value when it is in the list', function() {
    var arr = [1,2,4,5,0],
        cur = 4,
        zeroVal = 10,
        expected = 4,
        actual = later.array.next(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return the next highest value when cur is greater than last value', function() {
    var arr = [1,2,4,5,0],
        cur = 12,
        zeroVal = 10,
        expected = 1,
        actual = later.array.next(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

});