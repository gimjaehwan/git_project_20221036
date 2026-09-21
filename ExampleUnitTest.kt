package com.example.a2th

import android.util.Log
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.shadows.ShadowLog


/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@RunWith(RobolectricTestRunner::class)
@Config(sdk = [35])
class ExampleUnitTest {
    @Before
    fun setUpLogOutput() {
        ShadowLog.stream = System.out
    }

    @Test
    fun addition_isCorrect() {
        assertEquals(4, 2 + 2)

        val myName = "김재환"      // String형 추론
        val age: Int = 25          // 명시적 Int형 지정
        var numOne = 1;
        var numTwo = 3000000000
        var myByte: Byte = 1
        var myInt: Int = 20

        var myBoolean : Boolean = true

        var myChar1: Char = 'K'  // 변수 myChar1에 문자 값 'K'를 저장
        var myChar2: Char = 'o'  // 변수 myChar2에 문자 값 'o'를 저장
        var myChar3: Char = 't'  // 변수 myChar3에 문자 값 't'를 저장
        var myChar4: Char = 'l'  // 변수 myChar4에 문자 값 'l'을 저장
        var myChar5: Char = 'i'  // 변수 myChar5에 문자 값 'i'를 저장
        var myChar6: Char = 'n'  // 변수 myChar6에 문자 값 'n'을 저장

        var myLong = 25L  // 명시적 Long형 지정

        var myArray: IntArray = intArrayOf(1, 2, 3, 4, 5)

        var myString1: String = "Kotlin\n"  // 명시적 String형 지정
        var myString2: String = "Java"      // 명시적 String형 지정


        Log.d("코틀린 : 문자열 자료형", "String : " + myString1)
        Log.d("코틀린 : 문자열 자료형", "String : " + myString2)

        Log.d(
            "코틀린 : 배열 자료형",
            "배열의 3번째 값 : " + myArray[2]
        )

        Log.d("코틀린 : 정수 자료형", "Int : " + numOne)
        Log.d("코틀린 : 정수 자료형", "Long : " + numTwo)
        Log.d("코틀린 : 정수 자료형", "Byte : " + myByte)
        Log.d("코틀린 : 정수 자료형", "Int : " + myInt)
        Log.d("코틀린 : 정수 자료형", "Long : " + myLong)


        Log.d("코틀린: 불변 변수 val", "나의 이름은 " + myName + " 나이는 " + age)

        Log.d("코틀린: 부울린 자료형 ", "Boolean : " + myBoolean)
        Log.d(
            "코틀린 : 문자 자료형",
            "Char : " + myChar1 + myChar2 + myChar3 + myChar4 + myChar5 + myChar6
        )
    }
}
