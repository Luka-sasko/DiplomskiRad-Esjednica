package com.example.esjednica.Config;

public class GlasanjeEvent {
    private Long tockaId;
    private boolean aktivno;

    public GlasanjeEvent(Long tockaId, boolean aktivno) {
        this.tockaId = tockaId;
        this.aktivno = aktivno;
    }

    public Long getTockaId() { return tockaId; }
    public boolean isAktivno() { return aktivno; }

    public void setTockaId(Long tockaId) { this.tockaId = tockaId; }
    public void setAktivno(boolean aktivno) { this.aktivno = aktivno; }
}

