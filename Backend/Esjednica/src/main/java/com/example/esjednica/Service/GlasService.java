package com.example.esjednica.Service;

import com.example.esjednica.Model.Glas;
import com.example.esjednica.Repository.GlasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class GlasService {

    @Autowired
    private GlasRepository glasRepository;

    public Glas saveGlas(Glas glas) {
        return glasRepository.save(glas);
    }

    public List<Glas> findByTockaId(Long tockaId) {
        return glasRepository.findByTockaId(tockaId);
    }

    public boolean hasUserAlreadyVoted(Long tockaId, Long korisnikId) {
        return glasRepository.existsByTockaIdAndKorisnikId(tockaId, korisnikId);
    }


}