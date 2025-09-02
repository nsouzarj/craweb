package br.adv.cra.config;

import br.adv.cra.entity.Orgao;
import br.adv.cra.repository.OrgaoRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Profile("dev")
public class DatabaseLoader {
    
    private static final Logger log = LoggerFactory.getLogger(DatabaseLoader.class);
    
    private final OrgaoRepository orgaoRepository;
    
    @PostConstruct
    public void loadData() {
        log.info("Loading initial data...");
        
        // Check if we already have data
        if (orgaoRepository.count() == 0) {
            log.info("No orgaos found, loading initial data...");
            
            List<Orgao> orgaos = Arrays.asList(
                new Orgao(null, "Tribunal de Justiça"),
                new Orgao(null, "Tribunal Regional Federal"),
                new Orgao(null, "Superior Tribunal de Justiça"),
                new Orgao(null, "Tribunal Superior do Trabalho"),
                new Orgao(null, "Tribunal Regional do Trabalho")
            );
            
            orgaoRepository.saveAll(orgaos);
            log.info("Loaded {} orgaos", orgaos.size());
        } else {
            log.info("Orgaos already exist, skipping data load. Total count: {}", orgaoRepository.count());
        }
    }
}