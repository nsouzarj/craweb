package br.adv.cra.controller;

import br.adv.cra.entity.Processo;
import br.adv.cra.service.ProcessoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing legal processes.
 * 
 * This controller provides full CRUD operations for legal processes and advanced
 * search capabilities. Processes represent legal cases managed in the system.
 * 
 * Base URL: /api/processos
 */
@RestController
@RequestMapping("/api/processos")
@RequiredArgsConstructor
public class ProcessoController {
    
    private final ProcessoService processoService;
    
    /**
     * Creates a new process.
     * 
     * @param processo The process information to create
     * @return The created process with HTTP 201 status, or error response
     */
    @PostMapping
    public ResponseEntity<Processo> criar(@Valid @RequestBody Processo processo) {
        try {
            if (processoService.existeNumeroProcesso(processo.getNumeroprocesso())) {
                return ResponseEntity.badRequest().build();
            }
            Processo novoProcesso = processoService.salvar(processo);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoProcesso);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Updates an existing process.
     * 
     * @param id The ID of the process to update
     * @param processo The updated process information
     * @return The updated process, or error response
     */
    @PutMapping("/{id}")
    public ResponseEntity<Processo> atualizar(@PathVariable Long id, @Valid @RequestBody Processo processo) {
        try {
            if (!processoService.buscarPorId(id).isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            if (processoService.existeNumeroProcessoParaOutroProcesso(processo.getNumeroprocesso(), id)) {
                return ResponseEntity.badRequest().build();
            }
            
            processo.setId(id);
            Processo processoAtualizado = processoService.atualizar(processo);
            return ResponseEntity.ok(processoAtualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Lists all processes.
     * 
     * @return List of all processes
     */
    @GetMapping
    public ResponseEntity<List<Processo>> listarTodos() {
        try {
            List<Processo> processos = processoService.listarTodos();
            return ResponseEntity.ok(processos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Retrieves a process by ID.
     * 
     * @param id The ID of the process to retrieve
     * @return The process if found, or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Processo> buscarPorId(@PathVariable Long id) {
        try {
            return processoService.buscarPorId(id)
                    .map(processo -> ResponseEntity.ok(processo))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Finds process by process number.
     * 
     * @param numeroProcesso The process number to search for
     * @return The process if found, or 404 if not found
     */
    @GetMapping("/buscar/numero/{numeroProcesso}")
    public ResponseEntity<Processo> buscarPorNumeroProcesso(@PathVariable String numeroProcesso) {
        try {
            return processoService.buscarPorNumeroProcesso(numeroProcesso)
                    .map(processo -> ResponseEntity.ok(processo))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Searches processes by process number (partial match).
     * 
     * @param numero The process number to search for
     * @return List of matching processes
     */
    @GetMapping("/buscar/numero-pesquisa")
    public ResponseEntity<List<Processo>> buscarPorNumeroProcessoPesquisa(@RequestParam String numero) {
        try {
            List<Processo> processos = processoService.buscarPorNumeroProcessoPesquisa(numero);
            return ResponseEntity.ok(processos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Searches processes by party name (partial match).
     * 
     * @param parte The party name to search for
     * @return List of matching processes
     */
    @GetMapping("/buscar/parte")
    public ResponseEntity<List<Processo>> buscarPorParte(@RequestParam String parte) {
        try {
            List<Processo> processos = processoService.buscarPorParte(parte);
            return ResponseEntity.ok(processos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Searches processes by opposing party name (partial match).
     * 
     * @param adverso The opposing party name to search for
     * @return List of matching processes
     */
    @GetMapping("/buscar/adverso")
    public ResponseEntity<List<Processo>> buscarPorAdverso(@RequestParam String adverso) {
        try {
            List<Processo> processos = processoService.buscarPorAdverso(adverso);
            return ResponseEntity.ok(processos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Finds processes by status.
     * 
     * @param status The process status to search for
     * @return List of processes with the specified status
     */
    @GetMapping("/buscar/status/{status}")
    public ResponseEntity<List<Processo>> buscarPorStatus(@PathVariable String status) {
        try {
            List<Processo> processos = processoService.buscarPorStatus(status);
            return ResponseEntity.ok(processos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Searches processes by subject (partial match).
     * 
     * @param assunto The subject to search for
     * @return List of matching processes
     */
    @GetMapping("/buscar/assunto")
    public ResponseEntity<List<Processo>> buscarPorAssunto(@RequestParam String assunto) {
        try {
            List<Processo> processos = processoService.buscarPorAssunto(assunto);
            return ResponseEntity.ok(processos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Finds processes by court district.
     * 
     * @param comarcaId The court district ID to search for
     * @return List of processes in the specified court district
     */
    @GetMapping("/buscar/comarca/{comarcaId}")
    public ResponseEntity<List<Processo>> buscarPorComarca(@PathVariable Long comarcaId) {
        try {
            // Note: In a real implementation, you would fetch the Comarca first
            // This is simplified for demonstration
            List<Processo> processos = processoService.listarTodos()
                    .stream()
                    .filter(p -> p.getComarca() != null && p.getComarca().getId().equals(comarcaId))
                    .toList();
            return ResponseEntity.ok(processos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Finds processes by court.
     * 
     * @param orgaoId The court ID to search for
     * @return List of processes in the specified court
     */
    @GetMapping("/buscar/orgao/{orgaoId}")
    public ResponseEntity<List<Processo>> buscarPorOrgao(@PathVariable Long orgaoId) {
        try {
            // Note: In a real implementation, you would fetch the Orgao first
            // This is simplified for demonstration
            List<Processo> processos = processoService.listarTodos()
                    .stream()
                    .filter(p -> p.getOrgao() != null && p.getOrgao().getId().equals(orgaoId))
                    .toList();
            return ResponseEntity.ok(processos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Counts processes by status.
     * 
     * @param status The process status to count
     * @return The count of processes with the specified status
     */
    @GetMapping("/estatisticas/status/{status}")
    public ResponseEntity<Long> contarPorStatus(@PathVariable String status) {
        try {
            Long count = processoService.contarPorStatus(status);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Deletes a process.
     * 
     * @param id The ID of the process to delete
     * @return 204 No Content if successful, 404 if not found, or error response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            processoService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}