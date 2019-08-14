#include <eosio/eosio.hpp>
#include <eosio/multi_index.hpp>
// #include <eosiolib/multi_index.hpp>

// #include <eosiolib/crypto.h>

using namespace eosio;

class [[eosio::contract]] eosstorage : public contract {
  
  public:
      using contract::contract;
      
      eosstorage(name receiver, name code,  datastream<const char*> ds): contract(receiver, code, ds){}

      [[eosio::action]]
      void hi( name user ) {
        require_auth(user);
         print( "Hello, ", user);
      }
      
      [[eosio::action]]
      void upload(name user, std::string author, std::string title, std::string content, std::string time_upload){
        // uint64_t k = 0;
        setm st(get_self(), get_first_receiver().value);
        st.emplace(get_self(), [&](auto& row){
          row.pkey = st.available_primary_key();
          row.user = user;
          row.author = author;
          row.title = title;
          row.content = content;
          row.time_upload = time_upload;
          // k = row.pkey;
        });
        
        
        print("USER:", user, " | AUTHOR: ", author, " | TITLE: ", title, " | CONTENT:", content, " | TIME: ", time_upload);
        // struct article art = st.get(k);
      }
      
      [[eosio::action]]
      void articlelist(){
        setm st(get_self(), get_first_receiver().value);
        for(auto& item: st){
          print("USER:", item.user, " | AUTHOR: ", item.author, " | TITLE: ", item.title, " | CONTENT:", item.content, " | TIME: ", item.time_upload);
        }
      }
      
      
  private:
      struct [[eosio::table]] article{
        uint64_t pkey;
        std::string author;
        std::string title;
        std::string content;
        std::string time_upload;
        name user;
        
        uint64_t primary_key() const {
          return pkey;
        }
      };
      
      
      struct article record;
      typedef eosio::multi_index<"setm"_n, article> setm;
};
