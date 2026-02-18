package com.sak.ultimatetictactoe.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.sak.ultimatetictactoe.R

private val PixelTitleFamily = FontFamily(
    Font(R.font.silkscreen_bold, weight = FontWeight.Bold)
)

private val RoundedBodyFamily = FontFamily(
    Font(R.font.quicksand_variable, weight = FontWeight.Normal),
    Font(R.font.quicksand_variable, weight = FontWeight.Medium),
    Font(R.font.quicksand_variable, weight = FontWeight.SemiBold),
    Font(R.font.quicksand_variable, weight = FontWeight.Bold)
)

val AppTypography = Typography(
    headlineLarge = TextStyle(
        fontFamily = PixelTitleFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 28.sp,
        lineHeight = 34.sp,
        letterSpacing = 1.1.sp
    ),
    headlineMedium = TextStyle(
        fontFamily = PixelTitleFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 23.sp,
        lineHeight = 29.sp,
        letterSpacing = 0.9.sp
    ),
    titleLarge = TextStyle(
        fontFamily = PixelTitleFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 18.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.7.sp
    ),
    titleMedium = TextStyle(
        fontFamily = RoundedBodyFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
        lineHeight = 24.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = RoundedBodyFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        lineHeight = 22.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = RoundedBodyFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 20.sp
    ),
    labelLarge = TextStyle(
        fontFamily = RoundedBodyFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 14.sp,
        letterSpacing = 0.2.sp
    ),
    labelMedium = TextStyle(
        fontFamily = RoundedBodyFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 12.sp,
        letterSpacing = 0.2.sp
    )
)
