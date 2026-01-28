; ============================================
; FIXED NUMPAD REMAPPING SCRIPT
; ============================================
; IMPORTANT: Make sure NumLock is OFF (light should be off)

; ============================================
; NAVIGATION & CAPSLOCK TOGGLE
; ============================================
NumpadPgUp::Send "{Tab}"               ; Numpad 9 → Tab

; FIXED: CapsLock toggle with proper state detection
NumpadRight:: {                        ; Numpad 6 → CapsLock toggle
    if GetKeyState("CapsLock", "T")
        SetCapsLockState "Off"
    else
        SetCapsLockState "On"
}

+NumpadRight:: {                       ; Shift+Numpad 6 → CapsLock toggle
    if GetKeyState("CapsLock", "T")
        SetCapsLockState "Off"
    else
        SetCapsLockState "On"
}

; ============================================
; LETTER MAPPINGS - NOW RESPECT CAPSLOCK
; ============================================
; FIXED: Using Send instead of SendText to respect CapsLock/Shift

NumpadAdd:: {                          ; Numpad + → t/T
    if GetKeyState("CapsLock", "T")
        Send "T"
    else
        Send "t"
}

+NumpadAdd::Send "T"                   ; Shift+Numpad + → T (always caps)

NumpadSub:: {                          ; Numpad - → y/Y
    if GetKeyState("CapsLock", "T")
        Send "Y"
    else
        Send "y"
}

+NumpadSub::Send "Y"                   ; Shift+Numpad - → Y (always caps)

; ============================================
; BRACKETS
; ============================================
NumpadDiv::Send "["                    ; Numpad / → [
+NumpadDiv::Send "{{}"                 ; Shift+/ → {
!NumpadDiv::Send "<"                   ; Alt+/ → 

NumpadMult::Send "]"                   ; Numpad * → ]
+NumpadMult::Send "{}}"                ; Shift+* → }
!NumpadMult::Send ">"                  ; Alt+* → >

; ============================================
; BACKSPACE & DELETE
; ============================================
NumpadDel::Send "{Backspace}"          ; Numpad . → Backspace
^NumpadDel::Send "^+{Left}{Backspace}" ; Ctrl+. → Delete Word
^+NumpadDel::Send "^+{Up}{Backspace}"  ; Ctrl+Shift+. → Delete Line

; ============================================
; EMERGENCY CAPSLOCK FIX
; ============================================
^+!c:: {
    SetCapsLockState "Off"
    MsgBox "CapsLock forcibly turned OFF"
}

; ============================================
; STATUS CHECK
; ============================================
#n:: {
    numStatus := GetKeyState("NumLock", "T") ? "ON" : "OFF"
    capsStatus := GetKeyState("CapsLock", "T") ? "ON" : "OFF"
    
    MsgBox "
    (
    CURRENT STATUS:
    · NumLock: " numStatus " (needs to be OFF)
    · CapsLock: " capsStatus "
    
    NUMPAD MAPPINGS (NumLock OFF):
    · 9 (PgUp) → Tab
    · 6 (Right) → CapsLock toggle
    · + → t (or T if CapsLock ON)
    · - → y (or Y if CapsLock ON)
    · Shift++ → T (always)
    · Shift+- → Y (always)
    · . → Backspace
    
    EMERGENCY: Ctrl+Shift+Alt+C to force CapsLock OFF
    )"
}

; ============================================
; NUMLOCK TOGGLE
; ============================================
CapsLock & NumLock:: {
    SetNumLockState !GetKeyState("NumLock", "T")
    if GetKeyState("NumLock", "T")
        ShowToolTip("NumLock ON", 1500)
    else
        ShowToolTip("NumLock OFF - Mappings active", 1500)
}

ShowToolTip(text, duration := 2000) {
    ToolTip text, A_ScreenWidth//2 - 100, 10
    SetTimer () => ToolTip(), -duration
}