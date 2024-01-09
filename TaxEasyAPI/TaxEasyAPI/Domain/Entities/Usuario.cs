namespace TaxFacileAPI.Domain.Entities
{
    public class Usuario
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public char Ativo { get; set; }
        public byte[] PasswordHash { get; set;  }
        public byte[] PasswordSalt { get; set; }

        public Usuario(string id, string email, char ativo)
        {
            Id = id;
            ValidateDomain(email, ativo);
        }

        public void AlterarSenha(byte[] passwordHash, byte[] passwordSalt)
        {
            PasswordHash = passwordHash;
            PasswordSalt = passwordSalt;
        }

        private void ValidateDomain(string email, char ativo)
        {
            if (email == null || email.Length > 200) 
            {
                throw new ArgumentNullException("O usuário (email) é obrigatório e pode ter no máximo 200 caracteres.");
            }

            if (ativo != 'S' && ativo != 'N')
            {
                throw new ArgumentNullException("Informe se o usuário é ativo (S ou N).");
            }

            Email = email;
            Ativo = ativo;

        }

    }
}
